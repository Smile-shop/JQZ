
function clone(arr) {
  var _arr = [];
  for (let i = 0; i < arr.length; i++){
    _arr[i] = arr[i];
  }
  return _arr;
}

export function shuffle(arr) {
  var _arr = clone(arr);
  for (let i = 0; i < _arr.length; i++) {
    const randomIndex = Math.round(Math.random() * (_arr.length - 1 - i)) + i;
    [_arr[i], _arr[randomIndex]] = [_arr[randomIndex], _arr[i]]
  }
  return _arr;
}