import colors from 'colors';
import _ from 'lodash';

const printNoError = (a,b,c,desc) => {
  console.log('Discriminant is strictly negative, no real solution.'.bold.red);
};

const printDiscriminant = (a, b, c, discriminant) => {
  if (a === 0 || c === 0 ) {
    console.log(`\n∆ = ${b}^2 = ${discriminant}`.bold.yellow);  
  }
  else if (!(b)) {
    console.log(`\n∆ = ${b}^2 = ${discriminant}`.bold.yellow);  
  } else {
    console.log(`\n∆ = ${b}^2 - 4*${a}*${c} = ${discriminant}`.bold.yellow);  
  }
};

const printReduce = (s) => {
  const mapObj = { '.0':'', '+':'+ ','-':'- ','x^0':'','x^1': 'x'};
  const str = (_.reduce(s, (acc, val, key) => { 
    if (key > 0 && val[0] !== '-') val = `+${val}`;
    return `${acc} ${val}x^${key}`;
  }, '') + ' = 0')
    .trim()
    .replace(/\s\s+/,' ')
    .replace(/\.0|\+|\-|x\^0|x\^1/g, (m) => mapObj[m]) ;
  console.log('Reduce:'.padEnd(10).green, str);
};

const printAndCheckPolynome = (s) => {
  const poly = Object.keys(s).slice(-1).pop();
  console.log('Degree: '.padEnd(10).bold.blue, poly);
  if (poly > 2) {
    console.log('The polynomial degree is stricly greater than 2, I can\'t solve.'.bold.red)
  }
  return poly;
};

const header = () => {
  console.log('\n********** Welcome to Computer V1 software **********'.rainbow); // outputs green text
  console.log('\n***** Please Right down your expression *****\n'.bold.green); // outputs green text
};

export {
  header,
  printAndCheckPolynome,
  printDiscriminant,
  printNoError,
  printReduce
}