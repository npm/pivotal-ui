const _ = require('lodash');

module.exports = (md) => {
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
                            <pre>${defaultRule([Object.assign(_.clone(token), { content: b, info: 'html' })], 0, options, env, self)}</pre>
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
        } else {
            return defaultRule(tokens, idx, options, env, self);
        }
    }
}
