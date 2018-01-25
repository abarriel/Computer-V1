import colors from 'colors';
import _ from 'lodash';

process.stdin.setEncoding('utf8');

const mergeWithArray = (objValue, srcValue) => {
  if (_.isArray(objValue)) return objValue.concat(srcValue);
};

const cleanSpace = (s) => s.replace(/\s/g, '').trim().replace(/\+/g, ' +').replace(/\-/g, ' -');

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

const printReduce = (s) => {
  const mapObj = { '.0':'', '+':'+ ','-':'- ','x^0':'','x^1': 'x'};
  const str = (_.reduce(s, (acc, v) => { 
    let [val, key] = [Object.values(v)[0], Object.keys(v)[0]];
    if (key > 0 && val[0] !== '-') val = `+${val}`;
    return `${acc} ${val}x^${key}`;
  }, '') + ' = 0')
    .trim()
    .replace(/\s\s+/,' ')
    .replace(/\.0|\+|\-|x\^0|x\^1/g, (m) => mapObj[m]) ;
  console.log('Reduce:'.padEnd(10).green, str);
};

const printAndCheckPolynome = (s) => {
  const poly = Object.keys(s).length - 1 || 1;
  console.log('Degree: '.padEnd(10).blue, poly);
  if (poly > 2) {
    console.log('The polynomial degree is stricly greater than 2, I can\'t solve.'.bold.red)
  }
};

console.log('\n********** Welcome to Computer V1 software **********'.rainbow); // outputs green text
console.log('\n***** Please Right down your expression *****\n'.green); // outputs green text

process.stdout.write("> ".red);

process.stdin.on('readable', () => {
  const chunk = process.stdin.read();
  if (!chunk) return ;
  console.log('\n');
  console.log('Original:'.padEnd(10).red, chunk.trim());
  let [leftExp, tmp] = cleanSpace(chunk).split('=');
  tmp = groupByX(tmp.split(' '), true); // revert the sign because it from the right side
  leftExp = groupByX(leftExp.split(' '), false);
  _.mergeWith(tmp, leftExp, mergeWithArray);

  // console.log('tmp', tmp);
  const groupBy = _.compact(_.map(tmp, (v, i) => {
      const acc = _.reduce(v, (acc, va) => {
        let n = va;
        // console.log('va', va);
        if (va.includes('*')) n = va.split('*')[0];
        else if (va.includes('X')) n = va.split('X')[0];
        if(n.length <= 1) n = `${n}1`;
        // console.log('n', n);
        return (acc + parseFloat(n));
      }, 0).toPrecision(2);
      if (acc === 'NaN' || parseFloat(acc) === 0) return null;
      return ({ [i]: acc });
  }));
  // console.log(groupBy);
  printReduce(groupBy);
  printAndCheckPolynome(groupBy);
  // console.log(leftExp, rightExp);
  // // console.log('Process Reducing:'.green, `${leftExp}-${rightExp} = 0`.replace(/\+/g, ' + ').replace(/\-/g, ' - '));
  // const reduceExpTmp = `${leftExp}-${rightExp}`.replace(/\+/g, '+P').replace(/\-/g, '-M');
  // console.log(reduceExpTmp); 
  
  // tmp = reduceExpTmp.split(/\-|\+/).map(v => v.replace(/P/g, '+').replace(/M/g, '-'));
  // const groupBy = _.groupBy(tmp, (v) => {
  //     if (v.includes('X^0')) return 0;
  //     if (v.includes('X^1')) return 1;
  //     if (v.includes('X^2')) return 2;
  // });
  // console.log(groupBy);
  // console.log(g);
  // const reduceExp = _.reduce(groupBy,(acc, v, k) => {
  //     if(v)
  //     console.log(v);
  // },
  // '');
  // console.log(reduceExp);
  // console.log(groupBy)
  // console.log('Input'.yellow, exp.blue);
  // process.stdout.write("> ".red); 
});

// 5 * X^0 = 5 * X^0                                    tout les reel sont solution
// 4 * X^0 = 8                                          impossbile
// 5 * X^0 = 4 * X^0 + 7 * X^1                          1 Solution
// 5 * X^0 + 13 * X^1 + 3 * X^2 = 1 * X^0 + 1 * X^1     2 solution
// 6 * X^0 + 11 * X^1 + 5 * X^2 = 1 * X^0 + 1 * X^1     discriminant null 1 sol
// 5 * X^0 + 3 * X^1 + 3 * X^2 = 1 * X^0 + 0 * X^1      discriminant negatif  2 sol


// Bonus 
// 5 + 4 * X + X^2= X^2
// Reduced form: 5 + 4 * X = 0
// Polynomial degree: 1
// The solution is:
// -1.25

// 5 * X^0 + 4 * X^1 - 9.3 * X^2 = 1 * X^0
// Reduced form: 4 * X^0 + 4 * X^1 - 9.3 * X^2 = 0
// Polynomial degree: 2
// Discriminant is strictly positive, the two solutions are:
// 0.905239
// -0.475131

// 5 * X^0 + 4 * X^1 = 4 * X^0
// Reduced form: 1 * X^0 + 4 * X^1 = 0
// Polynomial degree: 1
// The solution is:
// -0.25

// 8 * X^0 - 6 * X^1 + 0 * X^2 - 5.6 * X^3 = 3 * X^0
// Reduced form: 5 * X^0 - 6 * X^1 + 0 * X^2 - 5.6 * X^3 = 0
// Polynomial degree: 3
// The polynomial degree is stricly greater than 2, I can't solve.