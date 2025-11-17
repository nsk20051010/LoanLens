export default class LoanClass {
  constructor({ _id=null, borrower=null, lender=null, principal=0, interestPercent=0, dueDate=null, note='' } = {}) {
    this._id = _id;
    this.borrower = borrower;
    this.lender = lender;
    this.principal = Number(principal) || 0;
    this.interestPercent = Number(interestPercent) || 0;
    this.dueDate = dueDate;
    this.note = note;
  }

  validate() {
    if (!this.borrower || !this.lender) return 'Borrower and lender required';
    if (this.borrower === this.lender) return 'Borrower and lender cannot be same';
    if (!(this.principal > 0)) return 'Principal must be > 0';
    if (this.interestPercent < 0) return 'Interest must be >= 0';
    return null;
  }

  toPayload() {
    return {
      borrowerId: this.borrower,
      lenderId: this.lender,
      principal: this.principal,
      interestPercent: this.interestPercent,
      dueDate: this.dueDate,
      note: this.note
    };
  }
}
