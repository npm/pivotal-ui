const _ = require('lodash');
const renderJSX = require('./multiplane-render-jsx');

let id = 0;

module.exports = (opts) => {
  return (md) => {
    const defaultRule = md.renderer.rules.fence;
    md.renderer.rules.fence = (tokens, idx, options, env, self) => {
      const token = tokens[idx];
      if (token.info == "html_example") {
        token.info == "html";
        return `<div class="codeExample">
          <div class="exampleOutput">${token.content}</div>
          <div class="codeBlock">${defaultRule(tokens, idx, options, env, self)}</div>
        </div>`;
      } else if (token.info == "html_example_table") {
        const blocks = token.content.split(/\n\n/).map(b => `<tr>
          <th>
            <div class="exampleOutput">${b}</div>
          </th>
          <td>
            <div class="codeBlock" aria-hidden="true">
              <div class="highlight">
                <pre>${defaultRule([Object.assign(_.clone(token), {
            content: b,
            info: 'html'
          })], 0, options, env, self)}</pre>
              </div>
            </div>
          </td>
        </tr>`)

        return `<div class="codeTable">
          <table role="presentation">
            <tbody>
              ${blocks.join('\n\n')}
            </tbody>
          </table>
        </div>`;
      } else if (token.info == "jsx_example") {
        token.info = "jsx";
        renderJSX.eval(token.content);
        return defaultRule(tokens, idx, options, env, self) + `<script>${renderJSX.compile(token.content)}</script>`;
      } else if (token.info == "react_example_table") {
        token.info = "jsx";
        const blocks = token.content.split(/\n\n/).filter(b => b.trim()).map(b => {
          const id = nextID();
          return `<tr>
          <th>
            <div class="exampleOutput" id="${id}">${renderJSX(b)}</div>
          </th>
          <td>
            <div class="codeBlock">
              ${defaultRule([Object.assign(_.clone(token), {
              content: b,
              info: 'jsx'
            })], 0, options, env, self)}
            </div>
            <script>window.addEventListener('load', function() { "use strict"; var el = ${renderJSX.compile(b)} React.render(el, document.getElementById("${id}")) })</script>
          </td>
        </tr>`
        })

        return `<div class="codeTable">
          <table role="presentation">
            <tbody>
              ${blocks.join('\n\n')}
            </tbody>
          </table>
        </div>`;
      } else if (token.info == "react_example") {
        token.info = "jsx";
        const id = nextID();
        return `<div class="codeExample">
          <div class="exampleOutput" id="${id}">${renderJSX(token.content)}</div>
          <div class="codeBlock">${defaultRule(tokens, idx, options, env, self)}</div>
          <script>window.addEventListener('load', function() { var el = ${renderJSX.compile(token.content)} React.render(el, document.getElementById("${id}")) })</script>
        </div>`;
      } else {
        return defaultRule(tokens, idx, options, env, self);
      }
    }
  }
}

function nextID() {
  return `react-example-${id++}`;
}
