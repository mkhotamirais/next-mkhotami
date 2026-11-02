export const linkClasses = {
  linkClass:
    "inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent data-[active=true]:bg-accent",
  panelBase:
    "absolute top-full z-50 pt-1 transition-[opacity,translate,visibility] duration-200 ease-out motion-reduce:transition-none",
  panelHidden: "invisible -translate-y-1 opacity-0",
  panelShown:
    "group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100",
};
