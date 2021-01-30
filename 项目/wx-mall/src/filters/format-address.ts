export function addressConcat(address: any): string {
  if (address) {
    return address.province.concat(
      address.city,
      address.district,
      address.address,
    );
  } else {
    return '';
  }
}
