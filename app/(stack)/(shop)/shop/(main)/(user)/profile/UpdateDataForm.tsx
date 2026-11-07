"use client";

// import { updateProfileData } from "@/actions/account";
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { FaCheck, FaSpinner, FaX } from "react-icons/fa6";
import { toast } from "sonner";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import { profileDataSchema } from "@/lib/schemas/user";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

type inferSchema = z.infer<typeof profileDataSchema>;

export default function UpdateDataForm() {
  const { data: session, update, status } = useSession();
  const user = session?.user;

  const form = useForm<inferSchema>({
    resolver: zodResolver(profileDataSchema),
    defaultValues: { name: user?.name || "", phone: user?.phone || "", email: user?.email || "" },
  });

  const watchedValues = useWatch({
    control: form.control,
  });

  const isDataUnchanged =
    (watchedValues.name || "") === (user?.name || "") &&
    (watchedValues.email || "") === (user?.email || "") &&
    (watchedValues.phone || "") === (user?.phone || "");

  const pending = form.formState.isSubmitting;

  const [pendingResend, startResend] = useTransition();
  const [isResend, setIsResend] = useState(false);

  const router = useRouter();

  const handleResend = () => {
    startResend(async () => {
      const res = await fetch("/api/account/verify-email-request", { method: "POST" });
      const data = await res.json();

      if (data?.error) {
        toast.error(data?.error);
      }
      toast.success(data?.message);
      setIsResend(true);
      setTimeout(() => {
        setIsResend(false);
      }, 3000);
    });
  };

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name ?? "",
        email: user.email ?? "",
        phone: user.phone ?? "",
      });
    }
  }, [user, form]);

  const onSubmit = async (data: inferSchema) => {
    const res = await fetch("/api/account/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    // const result = await updateProfileData(data);

    if (result?.error) {
      toast.error(result?.error);
      return;
    }
    toast.success(result?.message);
    await update({});
    router.refresh();
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  if (status === "loading") {
    return <Spinner />;
  }

  return (
    <div className="mb-6">
      <h2 className="h2 mb-2">Your Data</h2>
      {user?.name}
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <Input
                  {...field}
                  id="name"
                  aria-invalid={fieldState.invalid}
                  placeholder="Your Name"
                  autoComplete="off"
                />
                {fieldState.invalid && <FieldError>{fieldState.error?.message}</FieldError>}
              </Field>
            )}
          />
          <div>
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    {...field}
                    id="email"
                    aria-invalid={fieldState.invalid}
                    placeholder="example@email.com"
                    autoComplete="off"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <div className="mb-3">
              {user?.emailVerified ? (
                <div className="flex items-center gap-1 text-sm text-primary">
                  <FaCheck className="" />
                  verified
                </div>
              ) : (
                <div className="inline-flex flex-wrap items-center gap-1 text-sm">
                  <span className="flex items-center gap-1 text-red-500">
                    <FaX />
                    {user?.pendingEmail || "Email"} is unverified
                  </span>
                  (<span>Check your email or </span>
                  <button
                    disabled={pendingResend}
                    type="button"
                    onClick={handleResend}
                    className="underline text-primary flex items-center gap-1 disabled:opacity-50"
                  >
                    Request Verification {pendingResend && <FaSpinner className="animate-spin" />}{" "}
                    {isResend && <FaCheck className="text-green-500" />}
                  </button>
                  )
                </div>
              )}
            </div>
          </div>
          <Controller
            name="phone"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="phone">Phone</FieldLabel>
                <Input
                  {...field}
                  id="phone"
                  aria-invalid={fieldState.invalid}
                  placeholder="Phone Number"
                  autoComplete="off"
                />
              </Field>
            )}
          />
        </FieldGroup>
        <Button type="submit" disabled={pending || isDataUnchanged}>
          {pending && <Spinner />}
          Save
        </Button>
      </form>
    </div>
  );
}
