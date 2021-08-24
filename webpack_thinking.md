### 用到 `import` 和用到 `require` 编译的产出物不同，貌似只有用到 `require` 的结果里才有 runtime？
添加
```
optimization: {
    splitChunks: { chunks: "all" },
    runtimeChunk: { name: "runtime" },
  }
```
后 `import` 的代码也出现了 runtime，不然会被优化掉？
输出格式跟 `output.library.type` 也有关，如果不设默认是什么格式？