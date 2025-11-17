export default class MemberClass {
  constructor({ _id=null, name='', email='', phone='' } = {}) {
    this._id = _id;
    this.name = name;
    this.email = email;
    this.phone = phone;
  }

  isValid() {
    return typeof this.name === 'string' && this.name.trim().length > 0;
  }

  toPayload() {
    return { name: this.name.trim(), email: this.email, phone: this.phone };
  }
}
