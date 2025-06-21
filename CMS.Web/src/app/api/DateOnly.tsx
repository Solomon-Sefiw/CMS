// Assuming DateOnly has a structure like this
class DateOnly {
  constructor(public year: number, public month: number, public day: number) {}

  toDate(): Date {
    return new Date(this.year, this.month - 1, this.day); // Month is zero-based in Date
  }

  toString(): string {
    return `${this.year}-${String(this.month).padStart(2, "0")}-${String(
      this.day
    ).padStart(2, "0")}`;
  }
}
