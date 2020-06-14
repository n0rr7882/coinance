export function getPaletteType(): "dark" | "light" {
  const theme = localStorage.getItem("theme") as "dark" | "light" | undefined;
  return theme ? theme : "light";
}

export function switchPaletteType() {
  if (localStorage.getItem("theme") === "dark") {
    localStorage.setItem("theme", "light");
  } else {
    localStorage.setItem("theme", "dark");
  }
}
