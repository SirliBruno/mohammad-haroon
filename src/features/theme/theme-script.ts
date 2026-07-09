// Inlined at the top of <head> to set .dark before first paint (no FOUC).
export const themeInitScript = `(() => {
  try {
    var s = localStorage.getItem('mh-theme');
    var m = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var d = s === 'dark' || ((s === 'system' || !s) && m);
    if (d) document.documentElement.classList.add('dark');
    document.documentElement.style.colorScheme = d ? 'dark' : 'light';
  } catch (e) {}
})();`;
