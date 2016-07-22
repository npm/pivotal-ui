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
        } else {
            return defaultRule(tokens, idx, options, env, self);
        }
    }
}
