// Functions:
const mustachifyHTML = (html: string) => {
  if (!html.includes('data-type="grid"')) return html;

  const container = document.createElement('div');
  container.id = 'mustachify-html';
  container.style.position = 'absolute';
  container.style.left = '-9999px';

  container.innerHTML = html;
  document.body.appendChild(container);

  const gridElements = document.querySelectorAll('[data-type="grid"]');

  gridElements.forEach(gridElement => {
    if (!gridElement) return html;

    const dataSource = gridElement.attributes['data-source'].value;
    const gridRepeatableElement = document.evaluate(
      '//table/tbody/tr/td/div/table/tbody/tr[1]',
      gridElement,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    ).singleNodeValue as HTMLTableCellElement;

    const repeatableElementHTML = gridRepeatableElement.innerHTML;
    const elementInnerHTML = `
      <script id='mustache-template' type='x-tmpl-mustache'>
        {{#${dataSource}}}
          ${repeatableElementHTML}
        {{/${dataSource}}}
      </script>
    `;

    gridRepeatableElement.innerHTML = elementInnerHTML;
  });
  const finalHTML = container.innerHTML;

  document.body.removeChild(container);
  return finalHTML;
};

// Exports:
export default mustachifyHTML;
