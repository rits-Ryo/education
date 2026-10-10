'use strict';

// 計算範囲を制限し、整数を正確に扱える範囲と描画量を保つ。
const MAX_SIZE = 10;
const ENUMERATION_LIMIT = 5;

function validateSize(size) {
  if (!Number.isInteger(size) || size < 0 || size > MAX_SIZE) {
    throw new RangeError('n は0から10までの整数にしてください。');
  }
}

function factorial(size) {
  validateSize(size);
  let result = 1;
  for (let number = 2; number <= size; number += 1) {
    result *= number;
  }
  return result;
}

// D₀ = 1、D₁ = 0 から漸化式で計算する。
function derangementCount(size) {
  validateSize(size);
  if (size === 0) return 1;

  let previousTwo = 1;
  let previous = 0;
  for (let number = 2; number <= size; number += 1) {
    const current = (number - 1) * (previous + previousTwo);
    previousTwo = previous;
    previous = current;
  }
  return previous;
}

// 各位置で元と同じ番号を避け、重複しない並びを順に作る。
function listDerangements(size) {
  validateSize(size);
  if (size > ENUMERATION_LIMIT) {
    throw new RangeError('一覧を作成できるのは n ≦ 5 です。');
  }

  const results = [];
  const arrangement = [];
  const used = new Set();

  function visitPosition() {
    if (arrangement.length === size) {
      results.push([...arrangement]);
      return;
    }

    const position = arrangement.length + 1;
    for (let number = 1; number <= size; number += 1) {
      if (number === position || used.has(number)) continue;
      used.add(number);
      arrangement.push(number);
      visitPosition();
      arrangement.pop();
      used.delete(number);
    }
  }

  visitPosition();
  return results;
}

function reducedFraction(numerator, denominator) {
  let left = numerator;
  let right = denominator;
  while (right !== 0) {
    const remainder = left % right;
    left = right;
    right = remainder;
  }
  return `${numerator / left} / ${denominator / left}`;
}

// 数学の計算とDOM操作を分け、内容はtextContentで表示する。
function initializeLesson() {
  const selector = document.getElementById('size');
  const calculation = document.getElementById('calculation');
  const arrangements = document.getElementById('arrangements');

  function updateLesson() {
    const size = Number(selector.value);
    const count = derangementCount(size);
    const total = factorial(size);
    const result = document.createElement('p');
    result.textContent = `D${size} = ${count.toLocaleString('ja-JP')} 通り。確率：${reducedFraction(count, total)} ≈ ${(count / total).toFixed(6)}`;
    calculation.replaceChildren(result);
    arrangements.replaceChildren();

    if (size > ENUMERATION_LIMIT || size <= 1) {
      const message = document.createElement('p');
      message.textContent = size === 0
        ? '空の並びが1通りあります。'
        : size === 1
          ? '完全順列はありません。'
          : '並びの一覧は n ≦ 5 のときに表示します。';
      arrangements.append(message);
      return;
    }

    for (const arrangement of listDerangements(size)) {
      const item = document.createElement('span');
      item.className = 'arrangement';
      item.textContent = arrangement.join('・');
      arrangements.append(item);
    }
  }

  selector.addEventListener('change', updateLesson);
  updateLesson();
}

if (typeof document !== 'undefined') {
  initializeLesson();
}

// ブラウザを必要とせず、計算部分を検証できるようにする。
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { factorial, derangementCount, listDerangements, reducedFraction };
}
