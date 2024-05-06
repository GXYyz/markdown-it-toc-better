# markdown-it-toc-better

> The markdown-it plug-in is used to output a directory DOM or directory tree object to a markdown document
> markdown-it插件，用于输出目录DOM或目录树对象到markdown文档

## Usage

### Enable plugin

```js
import markdownit from 'markdown-it'
import markdownItToc from 'markdow-it-toc-better'
const md = markdownit({
  html: true,
  linkify: true,
  typography: true
})
.use(markdownItToc,{/*options*/}) // <-- this use(package_name) is required
```
options contains four parameters  
options包含四个参数
- includeLevel [array] 
  The default value is 3 levels [1,2,3]   
  默认值为[1,2,3]三级

- slugify [function] 
  Function used to custom directory anchor href rule，the function entry is the title, and the return value must be a string  
  自定义目录锚点href规则函数,函数入参为标题，返回值必须且为字符串

- getTocTree [function]
  Function used to acquire directory tree object，the function argument is a directory tree object  
  用于获取目录树对象的函数，函数入参为目录树对象

- getTocHTML [function]
  Function used to acquire directory DOM，the function argument is a DOM  
  用于获取目录DOM的函数,函数入参为DOM对象


### Example

You can declare the variable in advance to receive the tree object or DOM object returned by the plug-in, and then use it elsewhere in your code  
你可以提前声明变量以接收插件返回的树结构对象或DOM对象,然后在你代码的其他地方使用它

Since markdown-it itself is synchronous, there is no need to worry about asynchronicity, and when markdown-it is finished running, the variable will always point to the generated directory object (unless you did not assign it a value).  
由于markdown-it本身是同步的，所以不需要担心异步问题，当markdown-it运行完成后，变量一定会指向生成好的目录对象（除非你没给他赋值）


```js
let menuTree,mdLinkHTML
const md = require('markdown-it')({
  html: true,
  linkify: true,
  typography: true
})
.use(markdownItToc,
    {
      // Set directory level(设定目录级别)
      includeLevel: [1, 2, 3], 

      // Function used to custom directory anchor href rule，the function entry is the title, and the return value must be a string
      // (自定义目录锚点href规则函数,函数入参为标题，返回值必须且为字符串)
      slugify: (s) => s.replace(/\s*/g, ""), 

      // Function used to acquire directory tree object，the function argument is a directory tree object
      // (用于获取目录树对象的函数，函数入参为目录树对象)
      getTocTree: (tree) => {menuTree = tree}, // Assign the directory tree object to menuTree(将目录树对象赋值给menuTree)

      // Function used to acquire directory DOM，the function argument is a DOM
      // (用于获取目录DOM的函数,函数入参为DOM对象)
      getTocHTML: (tocDOM) => (mdLinkHTML = tocDOM) // Assign a DOM object to mdLinkHTML(将DOM对象赋值给mdLinkHTML)
    }
) 
```

In general, you only need to choose between tree objects and DOM objects  
通常来说，你只需要在树对象和DOM对象中二选一来使用
I recommend using tree objects to customize the directory structure, because I just generated a DOM, and it doesn't work well  
建议使用树对象来自定义目录结构，因为我只是随便生成了一个DOM，它并不好用

The end results looks like:  
生成的结果类似于:

```js
// menuTree
[
  {
    "level": 1,
    "content": "D3.js 基础使用",
    "children": [
        {
            "level": 2,
            "content": "元素操控函数",
            "children": [],
            "link": "#元素操控函数"
        },
        {
            "level": 2,
            "content": "功能性函数",
            "children": [
                {
                    "level": 3,
                    "content": "比例尺函数",
                    "children": [],
                    "link": "#比例尺函数"
                },
                ...
            ],
            "link": "#功能性函数"
        },
        ...
      ]
  }       
]
```
```html
<!-- mdLinkHTML -->
<ul>
  <li>
    <a href="#D3.js基础使用" class="leave_1 idx_0">D3.js 基础使用</a>
    <ul>
      <li><a href="#元素操控函数" class="leave_2 idx_0">元素操控函数</a></li>
      <li>
        <a href="#功能性函数" class="leave_2 idx_1">功能性函数</a>
        <ul>
          <li><a href="#比例尺函数" class="leave_3 idx_0">比例尺函数</a></li>
          ...
        </ul>
      </li>
      ...
    </ul>
  </li>
</ul>
```

