export const title       = '11) svg event'
export const description = `Display an circle into a overflow div`;

export async function script () {
  const {Base, RENDER, define}      = await import('/src/core/base.js');
  const {intersectionCoreExtension} = await import('/src/core/intersection.js');

  class MyComponent extends Base {

    [RENDER] () {
      this.shadowRoot.innerHTML = `
        <style>
          :host {
            display: inline-block;
          }
        </style>
        <style>
        .exit {
          fill: blue;
        }
        .stroke {
          stroke: black;
          stroke-width: 1;
        }
        .fill {
          fill: red;
        }
        </style>
        <svg viewBox="0 0 100 100" width="100" height="100">
          <circle cx="50" cy="50" r="50"/>
          <rect x="14" y="14" width="72" height="72"/> 
        </svg>`;
    }

    get svg () {
      return {
        _el : this.shadowRoot.querySelector('svg')
      };
    }
  }

  define(MyComponent)
    .extension(intersectionCoreExtension)
    .tag('my-component');

  const component = document.querySelector('my-component');
  const result    = document.querySelector('#result');
  component.addEventListener('render', () => {
    component.svg._el.addEventListener('intersection.enter', () => {
      result.innerHTML = 'intersection.enter';
      component.svg._el.classList.add('stroke');
      component.svg._el.classList.add('fill');
      component.svg._el.classList.remove('exit');
    });
    component.svg._el.addEventListener('intersection.exit', () => {
      result.innerHTML = 'intersection.exit';
      component.svg._el.classList.remove('stroke')
      component.svg._el.classList.remove('fill')
      component.svg._el.classList.add('exit');
    });
  });

}

export default `
<div id="container" style="width: 120px; height: 120px; overflow: auto">
  <my-component intersection-ratio="1" style="margin-top:120px;"></my-component>
</div>
<pre id="result"></pre>`;