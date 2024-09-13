import { insertTextAtPosition } from '../../utils/InsertTextAtPosition';
import { insertBeforeEachLine, selectLine } from '../../utils/markdownUtils';
import { TextAreaTextApi } from '../../commands';
import { writeCopyline } from '../../utils/copyline';

/**
 * - `13` - `Enter`
 * - `9` - `Tab`
 */
function stopPropagation(
  e: KeyboardEvent | React.KeyboardEvent<HTMLTextAreaElement>
) {
  e.stopPropagation();
  e.preventDefault();
}

function handleLineMove(
  e: KeyboardEvent | React.KeyboardEvent<HTMLTextAreaElement>,
  direction: number
) {
  stopPropagation(e);
  const target = e.target as HTMLTextAreaElement;
  const textArea = new TextAreaTextApi(target);
  let selection = { start: target.selectionStart, end: target.selectionEnd };
  selection = selectLine({ text: target.value, selection });
  if (
    (direction < 0 && selection.start <= 0) ||
    (direction > 0 && selection.end >= target.value.length)
  ) {
    return;
  }

  const blockText = target.value.slice(selection.start, selection.end);
  if (direction < 0) {
    const prevLineSelection = selectLine({
      text: target.value,
      selection: { start: selection.start - 1, end: selection.start - 1 },
    });
    const prevLineText = target.value.slice(
      prevLineSelection.start,
      prevLineSelection.end
    );
    textArea.setSelectionRange({
      start: prevLineSelection.start,
      end: selection.end,
    });
    insertTextAtPosition(target, `${blockText}\n${prevLineText}`);
    textArea.setSelectionRange({
      start: prevLineSelection.start,
      end: prevLineSelection.start + blockText.length,
    });
  } else {
    const nextLineSelection = selectLine({
      text: target.value,
      selection: { start: selection.end + 1, end: selection.end + 1 },
    });
    const nextLineText = target.value.slice(
      nextLineSelection.start,
      nextLineSelection.end
    );
    textArea.setSelectionRange({
      start: selection.start,
      end: nextLineSelection.end,
    });
    insertTextAtPosition(target, `${nextLineText}\n${blockText}`);
    textArea.setSelectionRange({
      start: nextLineSelection.end - blockText.length,
      end: nextLineSelection.end,
    });
  }
}

function getLineInfoAtPosition(text: string, position: number) {
  let p1 = 0;
  for (p1 = position; p1 > 0; p1--) {
    if (text[p1 - 1] === '\n') {
      break;
    }
  }
  if (p1 < 0) {
    p1 = 0;
  }
  let p2 = 0;
  for (p2 = position; p2 < text.length; p2++) {
    if (text[p2] === '\n') {
      break;
    }
  }
  return {
    start: p1,
    end: p2,
    text: text.slice(p1, p2),
  };
}

export default function handleKeyDown(
  e: KeyboardEvent | React.KeyboardEvent<HTMLTextAreaElement>,
  tabSize = 2,
  defaultTabEnable = false
) {
  const target = e.target as HTMLTextAreaElement;
  // 获取光标前的文本内容
  const starVal = target.value.slice(0, target.selectionStart);
  // 将光标前的文本内容按照换行符分割成数组
  const valArr = starVal.split('\n');
  // 获取当前行文本内容
  const currentLinePrefix = valArr[valArr.length - 1]!;
  // 创建 TextAreaTextApi 实例，用于操作 textarea 文本
  const textArea = new TextAreaTextApi(target);
  const isNoTextSelected = target.selectionStart === target.selectionEnd;
  const currentLineInfo = getLineInfoAtPosition(
    target.value,
    target.selectionStart
  );
  /**
   * `9` - `Tab`
   */
  // 如果默认 Tab 键功能未启用且按下的是 Tab 键
  if (!defaultTabEnable && e.code && e.code.toLowerCase() === 'tab') {
    // 阻止事件冒泡
    stopPropagation(e);
    // 生成指定数量的空格
    const space = new Array(tabSize + 1).join(' ');
    // 如果光标选中了文本
    if (target.selectionStart !== target.selectionEnd) {
      // 将光标前的文本内容和光标后的文本内容分别按照换行符分割成数组
      const _star = target.value
        .substring(0, target.selectionStart)
        .split('\n');
      const _end = target.value.substring(0, target.selectionEnd).split('\n');
      // 创建一个数组，用于保存修改后的文本内容
      const modifiedTextLine: string[] = [];
      // 遍历 _end 数组，比较每个元素与 _star 数组中对应元素是否相同，如果不同则添加到 modifiedTextLine 数组中
      _end.forEach((item, idx) => {
        if (item !== _star[idx]) {
          modifiedTextLine.push(item);
        }
      });
      // 将 modifiedTextLine 数组中的元素拼接成字符串
      const modifiedText = modifiedTextLine.join('\n');
      // 获取选中文本内容
      const oldSelectText = target.value.substring(
        target.selectionStart,
        target.selectionEnd
      );
      // 获取光标前的文本内容长度
      const newStarNum = target.value.substring(
        0,
        target.selectionStart
      ).length;
      // 设置光标位置
      textArea.setSelectionRange({
        start: target.value.indexOf(modifiedText),
        end: target.selectionEnd,
      });

      // 在每行文本前插入空格或删除空格
      const modifiedTextObj = insertBeforeEachLine(
        modifiedText,
        e.shiftKey ? '' : space
      );
      // 获取修改后的文本内容
      let text = modifiedTextObj.modifiedText;
      // 如果按下了 Shift 键，则删除每行文本开头的空格
      if (e.shiftKey) {
        text = text
          .split('\n')
          .map((item) => item.replace(new RegExp(`^${space}`), ''))
          .join('\n');
      }
      // 将修改后的文本内容替换选中文本内容
      textArea.replaceSelection(text);

      // 计算光标移动距离
      const startTabSize = e.shiftKey ? -tabSize : tabSize;
      const endTabSize = e.shiftKey
        ? -modifiedTextLine.length * tabSize
        : modifiedTextLine.length * tabSize;

      // 设置光标位置
      textArea.setSelectionRange({
        start: newStarNum + startTabSize,
        end: newStarNum + oldSelectText.length + endTabSize,
      });
    } else {
      // 如果光标未选中文本
      if (e.shiftKey) {
        // 在光标位置删除空格
        if (new RegExp(`^${space}`).test(currentLinePrefix)) {
          textArea.setSelectionRange({
            start: target.selectionStart - tabSize,
            end: target.selectionStart,
          });
          textArea.replaceSelection('');
        }
      } else {
        // 在光标位置插入空格
        insertTextAtPosition(target, space);
      }
    }
    return;
  }

  if (
    // 如果按下的是回车键
    e.keyCode === 13 &&
    e.code.toLowerCase() === 'enter' &&
    !e.shiftKey
  ) {
    /**
     * `13` - `Enter`
     */
    // 阻止事件冒泡
    stopPropagation(e);
    const enterKeyRegex = [
      // 1. AA
      /^(\s*)(\d+)\.\s(.+)/,
      // - BB
      /^(\s*)(-|\*)\s(.+)/,
      // - CC
      /^(\s*)(-|\*)\s(\[[\sxX]\])\s(.+)/,
      // - DD
      /^(\s*)([\S]+)/,
    ];
    const enterKeyRegexResults = enterKeyRegex.map((t) =>
      t.exec(currentLinePrefix)
    );
    const [regA, regB, regC, regD] = enterKeyRegexResults;
    // 如果当前行文本内容以数字加点开头，则插入下一个序号
    if (regA) {
      insertTextAtPosition(target, `\n${regA[1]}${Number(regA[2]) + 1}. `);
      return;
    }
    // 如果当前行文本内容以 '- [ ]' 或 '- [X]' 或 '- [x]' 开头，则插入 '- [ ] '
    if (regC) {
      insertTextAtPosition(target, `\n${regC[1]}${regC[2]} [ ] `);
      return;
    }
    // 如果当前行文本内容以 '*' 开头，则插入 '* '
    if (regB) {
      insertTextAtPosition(target, `\n${regB[1]}${regB[2]} `);
      return;
    }
    // 保持首行缩进
    if (regD) {
      insertTextAtPosition(target, `\n${regD[1]}`);
      return;
    }
    insertTextAtPosition(target, '\n');
    return;
  }

  if (e.code && e.code.toLowerCase() === 'keyd' && e.ctrlKey) {
    stopPropagation(e);
    // 获取光标位置
    let selection = { start: target.selectionStart, end: target.selectionEnd };
    // 保存光标位置
    const savedSelection = selection;
    // 选择整行文本
    selection = selectLine({ text: target.value, selection });
    // 获取选中文本内容
    const textToDuplicate = target.value.slice(selection.start, selection.end);
    // 设置光标位置到选中文本内容的末尾
    textArea.setSelectionRange({ start: selection.end, end: selection.end });
    // 在光标位置插入复制的文本内容
    insertTextAtPosition(target, `\n${textToDuplicate}`);
    // 恢复光标位置
    textArea.setSelectionRange({
      start: savedSelection.start,
      end: savedSelection.end,
    });
    return;
  }
  if (e.code && e.code.toLowerCase() === 'arrowup' && e.altKey) {
    // 将当前行文本向上移动
    handleLineMove(e, -1);
    return;
  }
  if (e.code && e.code.toLowerCase() === 'arrowdown' && e.altKey) {
    // 将当前行文本向下移动
    handleLineMove(e, 1);
    return;
  }
  if (
    e.code &&
    e.code.toLowerCase() === 'keyc' &&
    (e.ctrlKey || e.metaKey) &&
    isNoTextSelected
  ) {
    // 如果是ctrl + C 且无选区，拷贝当前行 currentLineStr
    stopPropagation(e);
    writeCopyline(currentLineInfo.text);
    return;
  }
  if (
    e.code &&
    e.code.toLowerCase() === 'keyx' &&
    (e.ctrlKey || e.metaKey) &&
    isNoTextSelected
  ) {
    // 如果是ctrl + X 且无选区，剪切当前行 currentLineStr
    stopPropagation(e);
    writeCopyline(currentLineInfo.text);
    textArea.setSelectionRange({
      start: Math.max(0, currentLineInfo.start - 1),
      end: currentLineInfo.end,
    });
    textArea.replaceSelection('');
    return;
  }
}
