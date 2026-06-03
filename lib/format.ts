const fmt = new Intl.DateTimeFormat("es-NI", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export function formatDate(date: Date) {
  return fmt.format(date);
}
