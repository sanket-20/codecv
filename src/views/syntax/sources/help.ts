/* eslint-disable no-irregular-whitespace */
export default `<h2 style="background:var(--background); color: var(--font-color); margin-bottom: 10px;">
<span style="color: var(--font-color); background:(--background); ">Introduction</span>
</h2>
<p style="background:var(--background); color: var(--font-color)">
<span style="line-height: 28px; color: var(--font-color)"
  >If you want to create a <strong>well-formatted resume</strong>, you can learn the following syntax. Don't worry, it won't take much time.</span
>
</p>
<h2 style="background:var(--background); color: var(--font-color); margin: 20px 0 10px 0;">
<span style="color: var(--font-color); background:(--background)">Flex Layout</span>
</h2>
<p style="background:var(--background); color: var(--font-color)">
<span style="line-height: 28px"
  ><span style="color: var(--font-color); background:(--background)">It will be rendered as a flex layout with the class</span
  ><code
    style="
      font-family: 'Microsoft YaHei Mono', Menlo, Monaco, Consolas, 'Courier New', monospace;
      color: rgb(229, 61, 14);
    "
    >flex-layout</code
  ><span style="color: var(--font-color); background:(--background)">, and the content in the middle of</span
  ><code
    style="
      font-family: 'Microsoft YaHei Mono', Menlo, Monaco, Consolas, 'Courier New', monospace;
      color: rgb(229, 61, 14);
    "
    >:::</code
  ><span style="color: var(--font-color); background:(--background)"
    > will be rendered as a flex item. You can use it to construct multi-column layouts as follows.</span
  ></span
>
</p>
<pre
lang=""
theme="dark"
class="tb-pre"
><div style="width:2.5em" class="tb-code-line-number-bg"></div><div class="tb-code-content"><div class="tb-code-line">::: start</div><div class="tb-code-line">content...</div><div class="tb-code-line">:::</div><div class="tb-code-line">content...</div><div class="tb-code-line">:::</div><div class="tb-code-line">content...</div><div class="tb-code-line">::: end</div></div><span class="tb-pre-lang"></span></pre>
<p style="background:var(--background); color: var(--font-color)">
<span style="line-height: 28px"
  ><span style="color: var(--font-color); background:(--background)">The above</span
  ><code
    style="
      font-family: 'Microsoft YaHei Mono', Menlo, Monaco, Consolas, 'Courier New', monospace;
      color: rgb(229, 61, 14);
    "
    >Markdown</code
  ><span style="color: var(--font-color); background:(--background)">&nbsp;syntax will be transformed into the following</span
  ><code
    style="
      font-family: 'Microsoft YaHei Mono', Menlo, Monaco, Consolas, 'Courier New', monospace;
      color: rgb(229, 61, 14);
    "
    >HTML</code
  ><span style="color: var(--font-color); background:(--background)">&nbsp;code.</span></span
>
</p>
<pre
lang="HTML"
theme="dark"
class="tb-pre"
><div style="width:2.5em" class="tb-code-line-number-bg"></div><div class="tb-code-content"><div class="tb-code-line">&lt;<span class="tb-hl-tag">div&nbsp;</span><span class="tb-hl-attr-name">class</span>="<span class="tb-hl-attr-value">flex-layout</span>"&gt;</div><div class="tb-code-line">&nbsp;&nbsp;&nbsp;&nbsp;&lt;<span class="tb-hl-tag">div&nbsp;</span><span class="tb-hl-attr-name">class</span>="<span class="tb-hl-attr-value">flex-layout-item</span>"&gt;content...&lt;/<span class="tb-hl-tag">div</span>&gt;</div><div class="tb-code-line">&nbsp;&nbsp;&nbsp;&nbsp;&lt;<span class="tb-hl-tag">div&nbsp;</span><span class="tb-hl-attr-name">class</span>="<span class="tb-hl-attr-value">flex-layout-item</span>"&gt;content...&lt;/<span class="tb-hl-tag">div</span>&gt;</div><div class="tb-code-line">&nbsp;&nbsp;&nbsp;&nbsp;&lt;<span class="tb-hl-tag">div&nbsp;</span><span class="tb-hl-attr-name">class</span>="<span class="tb-hl-attr-value">flex-layout-item</span>"&gt;content...&lt;/<span class="tb-hl-tag">div</span>&gt;</div><div class="tb-code-line">&lt;<span class="tb-hl-tag">div</span>&gt;</div></div><span class="tb-pre-lang">HTML</span></pre>
<h2 style="background:var(--background); color: var(--font-color); margin: 20px 0 10px 0;">
<span style="color: var(--font-color); background:(--background)">Personal Information Layout</span>
</h2>
<p style="background:var(--background); color: var(--font-color)">
<span style="line-height: 28px"
  ><span style="color: var(--font-color); background:(--background)"
    >If you want to format the personal information section of the resume separately, you can consider using the&nbsp;</span
  ><code
    style="
      font-family: 'Microsoft YaHei Mono', Menlo, Monaco, Consolas, 'Courier New', monospace;
      color: rgb(229, 61, 14);
    "
    >Head</code
  ><span style="color: var(--font-color); background:(--background)"
    >&nbsp;layout, specifically styling the personal information. It's similar to flex layout, and you need to use the&nbsp;</span
  ><code
    style="
      font-family: 'Microsoft YaHei Mono', Menlo, Monaco, Consolas, 'Courier New', monospace;
      color: rgb(229, 61, 14);
    "
    >:::</code
  ><span style="color: var(--font-color); background:(--background)"
    >&nbsp;syntax to divide it and provide start and end markers.</span
  ></span
>
</p>
<pre
lang=""
theme="dark"
class="tb-pre"
><div style="width:2.5em" class="tb-code-line-number-bg"></div><div class="tb-code-content"><div class="tb-code-line">::: headStart</div><div class="tb-code-line">content....</div><div class="tb-code-line">::: headEnd</div></div><span class="tb-pre-lang"></span></pre>
<p style="background:var(--background); color: var(--font-color)">
<span style="line-height: 28px"
  ><span style="color: var(--font-color); background:(--background)">The above</span
  ><code
    style="
      font-family: 'Microsoft YaHei Mono', Menlo, Monaco, Consolas, 'Courier New', monospace;
      color: rgb(229, 61, 14);
    "
    >Markdown</code
  ><span style="color: var(--font-color); background:(--background)">&nbsp;syntax will be transformed into the following</span
  ><code
    style="
      font-family: 'Microsoft YaHei Mono', Menlo, Monaco, Consolas, 'Courier New', monospace;
      color: rgb(229, 61, 14);
    "
    >HTML</code
  ><span style="color: var(--font-color); background:(--background)">&nbsp;code.</span></span
>
</p>
<pre
lang="HTML"
theme="dark"
class="tb-pre"
><div style="width:2.5em" class="tb-code-line-number-bg"></div><div class="tb-code-content"><div class="tb-code-line">&lt;<span class="tb-hl-tag">div&nbsp;</span><span class="tb-hl-attr-name">class</span>="<span class="tb-hl-attr-value">head-layout</span>"&gt;</div><div class="tb-code-line">&nbsp;&nbsp;&nbsp;&nbsp;content....</div><div class="tb-code-line">&lt;<span class="tb-hl-tag">div</span>&gt;</div></div><span class="tb-pre-lang">HTML</span></pre>
<h2 style="background:var(--background); color: var(--font-color); margin: 20px 0 10px 0;">
<span style="color: var(--font-color); background:(--background)">Built-in Icons</span>
</h2>
<p style="background:var(--background); color: var(--font-color)">
<span style="line-height: 28px; color: var(--font-color)"
  >I've also included some icons. If you want to use them, you can use the following syntax, <strong>it's recommended to end with a space</strong>.</span
>
</p>
<pre
lang=""
theme="dark"
class="tb-pre"
><div style="width:2.5em" class="tb-code-line-number-bg"></div><div class="tb-code-content"><div class="tb-code-line">icon:github&nbsp;</div></div><span class="tb-pre-lang"></span></pre>
<p style="background:var(--background); color: var(--font-color)">
<span style="line-height: 28px"
  ><span style="color: var(--font-color); background:(--background)">The above</span
  ><code
    style="
      font-family: 'Microsoft YaHei Mono', Menlo, Monaco, Consolas, 'Courier New', monospace;
      color: rgb(229, 61, 14);
    "
    >Markdown</code
  ><span style="color: var(--font-color); background:(--background)">&nbsp;syntax will be transformed into the following</span
  ><code
    style="
      font-family: 'Microsoft YaHei Mono', Menlo, Monaco, Consolas, 'Courier New', monospace;
      color: rgb(229, 61, 14);
    "
    >HTML</code
  ><span style="color: var(--font-color); background:(--background)">&nbsp;code.</span></span
>
</p>
<pre
lang="HTML"
theme="dark"
class="tb-pre"
><div style="width:2.5em" class="tb-code-line-number-bg"></div><div class="tb-code-content"><div class="tb-code-line">&lt;<span class="tb-hl-tag">i&nbsp;</span><span class="tb-hl-attr-name">class</span>="<span class="tb-hl-attr-value">iconfont icon-github</span>"&gt;&lt;/<span class="tb-hl-tag">i</span>&gt;</div></div><span class="tb-pre-lang">HTML</span></pre>
<h2 style="background:var(--background); color: var(--font-color); margin: 20px 0 10px 0;">
<span style="color: var(--font-color); background:(--background)">Conclusion</span>
</h2>
<p style="background:var(--background); color: var(--font-color)">
<span style="line-height: 28px"
  ><span style="color: var(--font-color); background:(--background)"
    >These are some special syntaxes supported by this resume. Other syntaxes are in sync with the original</span
  ><code
    style="
      font-family: 'Microsoft YaHei Mono', Menlo, Monaco, Consolas, 'Courier New', monospace;
      color: rgb(229, 61, 14);
    "
    >Markdown</code
  ><span style="color: var(--font-color); background:(--background)"
    >. <strong>If you have good ideas</strong>, you can suggest them to me. Feel free to contribute different resume templates to this project. Thank you.&nbsp;<a target="null" href="https://github.com/acmenlei/markdown-resume-to-pdf"
      >Repository link</a
    ></span
  ></span
>
</p>`;
