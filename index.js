import colors from 'colors';
import _ from 'lodash';

import { header, printAndCheckPolynome, printDiscriminant, printNoError, printReduce } from './print';
import { mergeWithArray, gcd, cleanSpace, isPolynomeNull } from './tools';

process.stdin.setEncoding('utf8');

const groupByX = (s, revert) => _.reduce(s, (acc,v,i) => {
    let n;
    if (v.includes('X^0') || !v.includes('X')) n = 0;
    else if (v.includes('X^1') || /[X^\^]$/.test(v)) n = 1;
    else if (v.includes('X^2')) n = 2;
    else n = 3;
    if (revert) 
    { 
      if (v[0] !== '-' && v[0] === '+') v = `-${v.substr(1)}`;
      else if (v[0] !== '-') v = `-${v}`;
      else v = `+${v.substr(1)}`;
    }
    if (v[0] !== '-' && v[0] !== '+') v = `+${v}`;
    if (!acc[n]) return { ...acc, [n]: [v]};
    return { ...acc, [n]: _.concat(acc[n], v)};
  }, {});

const getFractionIfFloat = (float) => {
  const len = (float + "").slice((float + "").indexOf('.') + 1).length;
  const denominator = Math.pow(10, len);
  const pgcd = gcd(float * denominator, denominator);
  if ((denominator / pgcd) === 1) return `${float}`;
  return `${float.toFixed(6 < len ? 6 : len)} or ${((float * denominator / pgcd) + "").slice(0, 6)}/${((denominator / pgcd) + "").slice(0,6)}`;
};

header();

// process.stdout.write("> ".red);

process.stdin.on('readable', () => {
  process.stdout.write("> ".red);  
  const chunk = process.stdin.read();
  if (!chunk) return ;
  let [leftExp, tmp] = cleanSpace(chunk).split('=');
  if(!tmp) return ;
  console.log('\n');
  console.log('Original:'.padEnd(10).bold.red, chunk.trim());
  tmp = groupByX(tmp.split(' '), true); // revert the sign because it from the right side
  leftExp = groupByX(leftExp.split(' '), false);
  _.mergeWith(tmp, leftExp, mergeWithArray);

  const groupBy = _.reduce(tmp, (acc, v, i) => {
      const res = _.reduce(v, (res, va) => {
        let n = va;
        if (va.includes('*')) n = va.split('*')[0];
        else if (va.includes('X')) n = va.split('X')[0];
        if (n.length <= 1) n = `${n}1`;
        return (res + parseFloat(n));
      }, 0).toPrecision(2);
      if (res === 'NaN' || parseFloat(res) === 0) return acc;
      return ({ ...acc, [i]: res });
  }, {});
  if (_.isEmpty(groupBy) && chunk.includes('X')) {
    console.log('All reals are solution');
    process.stdout.write("> ".red);  
    return
  }
  if (_.isEmpty(groupBy) || isPolynomeNull(groupBy)) {
    console.log('😂 😂 😂');
    process.stdout.write("> ".red);  
    return
  }
  printReduce(groupBy);
  const polynome = printAndCheckPolynome(groupBy);
  const { 0:c = 0, 1:b = 0, 2:a = 0 } = _.map(groupBy, parseFloat);

  if (polynome == 1) {
    console.log(`\nThe solution is: ${getFractionIfFloat((c * -1)/ b).bold.green}`);    
    process.stdout.write("> ".red);  
    return ;
  }
  const dis = b*b - 4*a*c;
  printDiscriminant(a,b,c,dis);
  if (dis < 0) {
    console.log('Discriminant is strictly negative, no real solution.'.bold.red);
    console.log(`The two complexes solution are: z1 = -${b}-i√${dis * -1}/(2*${a}) and z2 = -${b}+i√${dis * -1}/(2*${a})`)
  }
  if (dis == 0) {
    const x0 = -b / (2*a);
    console.log('Discriminant is strictly equal to zero.');    
    console.log(`\nThe solution is: ${getFractionIfFloat(x0).bold.green}`);
  }
  if (dis > 0) {
    const x1 = (-b - Math.sqrt(dis)) / (2*a);
    const x2 = (-b + Math.sqrt(dis)) / (2*a);
    console.log('Discriminant is strictly positive, the two solutions are:');
    console.log(`x1 = ${getFractionIfFloat(x1).bold.green} and x2 = ${getFractionIfFloat(x2).bold.blue}`);
  }
  // console.log('Press Enter For a new shot\n');
  return;
});