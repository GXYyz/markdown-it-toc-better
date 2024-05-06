
/**
 * markdown-it-toc-better
 * 
 * @param {Object} md - markdownit Object(库传入对象) required
 * @param {Object} options - config object(配置对象) required
 * @param {Array} options.includeLevel - Set directory level(设定目录级别)
 * @param {Function} options.slugify - Function used to custom directory anchor href rule(自定义目录锚点href规则函数)
 * @param {Function} options.getTocTree - Function used to acquire directory tree object，the function argument is a directory tree object(用于获取目录树对象的函数，函数入参为目录树对象)
 * @param {Function} options.getTocHTML - Function used to acquire directory DOM，the function argument is a DOM(用于获取目录DOM的函数,函数入参为DOM对象)
 */
export default function(md,options) {
  // Add anchor when generating the title
  // 生成标题时加入锚点
  md.renderer.rules.heading_open = function(tokens, index) {
      let slugify = typeof options.slugify === "function" ? options.slugify : function (s) { return s; };
      let level = tokens[index].tag;
      let label = tokens[index + 1];
      let link = slugify(label.content)
      if (label.type === 'inline') {
          return `<${level}><a id="#${link}"></a>`;
      } else {
          return '</h1>';
      }
  };

  // Get the title node
  // 获取标题节点
  function findHeadings(tokens, option) {
    let _a, _b, _c;
    let headings = [];
    let size = tokens.length;
    let slugify = typeof option.slugify === "function" ? option.slugify : function (s) { return s; };
    let includeLevel = option.includeLevel || [1, 2, 3, 4];
    let index = 0;
    while (index < size) {
      let token = tokens[index];
      let level = (_c = +((_b = (_a = token === null || token === void 0 ? void 0 : token.tag) === null || _a === void 0 ? void 0 : _a.substr) === null || _b === void 0 ? void 0 : _b.call(_a, 1, 1))) !== null && _c !== void 0 ? _c : -1;
      if (token.type === "heading_open" && includeLevel.indexOf(level) !== -1) {
        let content = tokens[index + 1].content;
        let h = {
          level: level,
          content: content,
          parent: null,
          children: [],
          link: "#" + slugify(content),
        };
        headings.push(h);
        index += 3;
      }
      else {
        index++;
      }
    }
    return headings;
  }

  // Generate node tree
  // 生成节点树
  function flat2Tree(headings) {
    let current = null;
    let root = [];
    for (let i = 0; i < headings.length; i++) {
      let h = headings[i];
      if (h.level === 1) {
        root.push(h);
        current = null;
      }
      if (current === null) {
        current = h;
      }
      else {
        while (h.level !== current.level + 1) {
          if (h.level > current.level && current.children.length !== 0) {
            current = current.children[current.children.length - 1];
          }
          else if (h.level <= current.level && current.parent !== null) {
            current = current.parent;
          }
          else {
            break;
          }
        }
        if (h.level === current.level + 1) {
          h.parent = current;
          current.children.push(h);
          current = h;
        }
      }
    }
    return root;
  }

  // Remove redundant branches
  // 去除冗余分支
  function removeUselessProperties(hsd) {
    for (let i = 0; i < hsd.length; i++) {
      delete hsd[i].parent;
      removeUselessProperties(hsd[i].children);
    }
  }

  // Generate directory elements
  // 生成目录元素
  function renderToc(tree) {
    let TocContainer = document.createElement('ul')
    let levelInner = 0
    let tocHTML = tree.reduce((pre,cur) => {
      let headerContainer = document.createElement('li')
      let link = document.createElement('a')
      link.href = cur.link
      link.className = `leave_${cur.level} idx_${levelInner}`
      levelInner ++
      link.innerText = cur.content
      headerContainer.append(link)

      if(cur.children.length > 0){
        let childrenDOM = cur.children
        headerContainer.append(renderToc(childrenDOM))
        pre.append(headerContainer)
      }else{
        pre.append(headerContainer)
      }
      return TocContainer
    },TocContainer)
    return tocHTML
  }

  // Generate and return the title node tree
  // 生成并返回标题节点树
  md.core.ruler.push("toc_desc", function (state) {
    const o = options 
    let _a,_c;
    let _b = (o === null || o === void 0) ? void 0 : (typeof o.render === 'function' ? void 0 : o.render);
    let headings = findHeadings(state.tokens, o);
    let tree = flat2Tree(headings);
    removeUselessProperties(tree);
    (_a = o === null || o === void 0 ? void 0 : (typeof o.getTocTree === 'function' ? o.getTocTree : void 0)) === null || _a === void 0 ? void 0 : _a.call(o, tree);
    (_c = (o === null || o === void 0) ? void 0 : (typeof o.getTocHTML === 'function' ? o.getTocHTML : void 0)) === null || _c === void 0 ? void 0 : _b === void 0 ? _c.call(o, renderToc(tree)) :_c.call(o, _b.call(o,tree));
    return true;
  });
  

}