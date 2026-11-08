// Local text editor. Open edit.html; export replaces index.html after review.
(() => {
  if (new URLSearchParams(location.search).get('edit') !== '1') return;
  document.documentElement.classList.add('editing');
  const selectors = 'main p, main h1, main h2, main h3, main figcaption, main .date, main .actions a, main .status, main .tags span, main .result-pair strong, main .result-pair span';
  document.querySelectorAll(selectors).forEach(element => {
    element.setAttribute('contenteditable', 'plaintext-only');
    element.dataset.localEditable = 'true';
  });
  const panel = document.createElement('aside');
  panel.className = 'editor-panel';
  panel.setAttribute('aria-label', 'Local text editor');
  panel.innerHTML = '<strong>本地文字编辑</strong><p>点击虚线框修改文字。完成后导出 HTML，并用它替换 dist 文件夹中的 index.html。未导出的修改在刷新或关闭后会丢失。</p><div><button type="button" id="export-page">导出修改后的 index.html</button><a href="index.html">退出编辑</a></div><p role="status" id="editor-status"></p>';
  document.body.appendChild(panel);
  document.getElementById('export-page').addEventListener('click', () => {
    const copy = document.documentElement.cloneNode(true);
    copy.classList.remove('editing');
    if (!copy.className) copy.removeAttribute('class');
    copy.querySelector('.editor-panel')?.remove();
    copy.querySelectorAll('[data-local-editable]').forEach(element => {
      element.removeAttribute('contenteditable');
      element.removeAttribute('data-local-editable');
      element.removeAttribute('spellcheck');
    });
    const blob = new Blob(['<!doctype html>\n' + copy.outerHTML + '\n'], {type: 'text/html;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'index.html';
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 30000);
    document.getElementById('editor-status').textContent = '已请求下载。请将下载文件放回 dist 文件夹并替换 index.html；图片、CSS 和 editor.js 保持原位。';
    changed = false;
  });
  // Keep text links editable without following them during a click.
  document.querySelectorAll('.actions a').forEach(link => link.addEventListener('click', event => event.preventDefault()));
  let changed = false;
  document.querySelector('main').addEventListener('input', () => { changed = true; });
  window.addEventListener('beforeunload', event => {
    if (changed) { event.preventDefault(); event.returnValue = ''; }
  });
})();
