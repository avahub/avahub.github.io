const className = "dynamicClass";
const targetId = "render_output";
const common_jsx = `var reactRoot = ReactDOM.createRoot(window["${targetId}"]); reactRoot.render(<MyApp />);`;
const editor_default_content = `
function MyApp() {
  React.useEffect(() => {
    console.log("rendered");
  });
  return (
    <div>
      <h1>Welcome to my app2</h1>
    </div>
  );
}
`;
const editor_default_content_with_tags_replaced = editor_default_content
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;");

function appendScriptTag(code) {
  var script = window["myscript"];
  script?.remove();
  script = document.createElement("script");
  script.id = "myscript";
  script.textContent = code;
  document.head.appendChild(script);
}

function appendStyleTag(selector, properties) {
  var styleSheet = window["mystyle"];
  if (!styleSheet) {
    styleSheet = document.createElement("style");
    styleSheet.id = "mystyle";
    document.head.appendChild(styleSheet);
  }
  const rules = styleSheet.sheet;
  const rule = rules.insertRule(
    `${selector} { ${Object.entries(properties)
      .map(([key, value]) => `${key}: ${value};`)
      .join(" ")} }`,
    rules.cssRules.length
  );
}

function jsx_to_js(param) {
  return Babel.transform(param, {
    presets: ["react"],
  }).code;
}

function colorcode_text(text) {
  const keywords = ["React", "console", "<div>", "</div>", "function", "var"]; // Add more keywords as needed
  const keywordRegex = new RegExp(`\\b(${keywords.join("|")})\\b`, "g");
  console.log(
    text.replace(keywordRegex, `<span style="color: blue">$1</span>`)
  );
  return text.replace(keywordRegex, `<span style="color: blue">$1</span>`);
}

function readFile(event) {
  if (event.target.files && event.target.files[0]) {
    var reader = new FileReader();
    reader.readAsText(event.target.files[0]);
    reader.onload = function (readerEvent) {
      appendScriptTag(jsx_to_js(readerEvent.target.result + common_jsx));
    };
  }
}

function push_to_render(event) {
  appendScriptTag(
    jsx_to_js(
      (event.target?.innerHTML || event.value)
        .replaceAll("&lt;", "<")
        .replaceAll("&gt;", ">") + common_jsx
    )
  );
}
