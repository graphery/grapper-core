export const title       = '11) Manage the life cycle'
export const description = `RENDER return false and REFRESH forced`;

export async function script () {
  const wait                                     = t => new Promise(resolve => setTimeout(resolve, t));
  const {Base, RENDER, REFRESH, CONTEXT, define} = await import('/src/core/base.js');

  class MyComponent extends Base {

    async load () {
      const ctx = this [CONTEXT];
      await wait(2000)
      ctx.label = 'hello Grapper';
      this[REFRESH](true);
    }

    [RENDER] () {
      this.load();
      this.shadowRoot.innerHTML = `
        <style>
          :host {
            display: inline-block;
          }
        </style>
        <svg viewBox="0 0 200 100" width="200" height="100">
          <ellipse cx="100" cy="50" rx="100" ry="50" fill="blue"/>
          <text x="50%" y="50%" text-anchor="middle" fill="white" dy="0.2em" font-size="20">loading...
          </text>
        </svg>`;
      return false;
    }

    [REFRESH] () {
      const ctx      = this [CONTEXT];
      const text     = this.shadowRoot.querySelector('text');
      text.innerHTML = ctx.label;
    }

  }

  define(MyComponent)
    .attr({name : 'delay', type : 'number', value : 0, posUpdate : 'load'})
    .attr({name : 'label', type : 'string', value : '', posUpdate : REFRESH})
    .tag('my-component');
}

export default `
<my-component delay="2"></my-component>
`;