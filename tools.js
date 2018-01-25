import colors from 'colors';
import _ from 'lodash';

const mergeWithArray = (objValue, srcValue) => {
  if (_.isArray(objValue)) return objValue.concat(srcValue);
};

const gcd = (n, d) => {
  if (d === 0) return n; 
  return gcd(d, n % d);
};

const cleanSpace = (s) => s.replace(/\s/g, '').trim().replace(/\+/g, ' +').replace(/\-/g, ' -');

const isPolynomeNull = (g) => {
  const keys = Object.keys(g);
  if (_.includes(keys, '1') || _.includes(keys, '2')) return false;
  return true;
}
export {
  isPolynomeNull,
  mergeWithArray,
  gcd,
  cleanSpace
}