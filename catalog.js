'use strict';

// Resolve from this file, so GitHub Pages repository prefixes and nested pages
// both work without hard-coded hostnames or leading-slash links.
const catalogRoot = new URL('./', document.currentScript.src);
const catalog = window.educationCatalog;

function catalogElement(tag, text, className) {
  const element = document.createElement(tag);
  if (text !== undefined) element.textContent = text;
  if (className) element.className = className;
  return element;
}

function catalogLink(path) {
  const url = new URL(path, catalogRoot);
  if (url.origin !== catalogRoot.origin ||
      !url.pathname.startsWith(catalogRoot.pathname) ||
      /(?:^|\/)\.local(?:\/|$)/.test(url.pathname)) {
    throw new Error('教材のリンクは公開用フォルダー内に指定してください。');
  }
  return url.href;
}

function catalogCard(item, action, category, tags) {
  const card = catalogElement('article', undefined, 'material catalog-card');
  const body = catalogElement('div', undefined, 'material-body');
  body.append(
    catalogElement('p', category, 'category'),
    catalogElement('h3', item.title),
    catalogElement('p', item.description, 'description')
  );
  if (tags.length) {
    const list = catalogElement('ul', undefined, 'tags');
    list.setAttribute('aria-label', '主な機能');
    for (const tag of tags) list.append(catalogElement('li', tag));
    body.append(list);
  }
  const link = catalogElement('a', action + ' →', 'open-material');
  link.href = catalogLink(item.path);
  link.setAttribute('aria-label', item.title + '：' + action);
  body.append(link);
  card.append(body);
  return card;
}

const catalogList = document.getElementById('catalog-list');
const subjectId = document.body.dataset.subject;
if (subjectId) {
  const subject = catalog.subjects.find((item) => item.id === subjectId);
  if (!subject) {
    catalogList.append(catalogElement('p', 'この教科は登録されていません。'));
  } else {
    document.title = subject.title + 'の教材 | education';
    document.getElementById('page-title').textContent = subject.title + 'の教材';
    document.getElementById('page-description').textContent = subject.description;
    document.getElementById('subject-name').textContent = subject.title;
    for (const material of subject.materials) {
      catalogList.append(catalogCard(material, '教材を開く',
        material.category, material.tags || []));
    }
    if (!subject.materials.length) {
      const empty = catalogElement('div', undefined, 'empty-catalog');
      empty.append(catalogElement('h3', '教材はこれから追加します'),
        catalogElement('p', '公開された教材は、このページに表示されます。'));
      catalogList.append(empty);
    }
  }
} else {
  for (const subject of catalog.subjects) {
    const count = subject.materials.length;
    catalogList.append(catalogCard(subject, '教材一覧へ',
      count ? count + '教材を公開中' : '教材の追加予定', []));
  }
}
