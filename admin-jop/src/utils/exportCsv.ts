/*
  inspired by https://www.npmjs.com/package/react-csv-downloader
  now removed from Github
*/

const newLine = '\r\n';
const appendLine = (content: any, row: any, { separator, quoted }: any) => {
  const line = row.map((data: any) => {
    if (!quoted) {
      return data;
    }
    // quote data
    data = typeof data === 'string' ? data.replace(/"/g, '"') : data;
    return `"${data}"`;
  });
  content.push(line.join(separator));
};

const defaults = {
  separator: ',',
  quoted: false
};

function csv(columns: any, datas: any, options: any, noHeader = false) {
    options = Object.assign({}, defaults, options);
    let columnOrder: any = null;
    const content: any[] = [];
    const column: any[] = [];

    if (columns) {
      columnOrder = columns.map((v: any) => {
        if (typeof v === 'string') {
          return v;
        }
        if (!noHeader) {
          column.push(typeof v.title !== 'undefined' ? v.title : v.key);
        }
        return v.key;
      });
      if (column.length > 0) {
        appendLine(content, column, options);
      }
    } else {
      columnOrder = [];
      datas.forEach((v: any) => {
        if (!Array.isArray(v)) {
          columnOrder = columnOrder.concat(Object.keys(v));
        }
      });
      if (columnOrder.length > 0) {
        columnOrder = columnOrder.filter((value: any, index: number, self: any) => self.indexOf(value) === index);
        if (!noHeader) {
          appendLine(content, columnOrder, options);
        }
      }
    }

    if (Array.isArray(datas)) {
      datas.forEach((row: any) => {
        if (!Array.isArray(row)) {
          row = columnOrder.map((k: any) => (typeof row[k] !== 'undefined' ? row[k] : ''));
        }
        appendLine(content, row, options);
      });
    }
    return content.join(newLine);
}

function has(browser: string) {
  const ua = navigator.userAgent;
  if (browser === 'ie') {
      const isIE = ua.indexOf('compatible') > -1 && ua.indexOf('MSIE') > -1;
      if (isIE) {
          const reIE = new RegExp('MSIE (\\d+\\.\\d+);');
          reIE.test(ua);
          return parseFloat(RegExp[`$1`]);
      } else {
          return false;
      }
  } else {
      return ua.indexOf(browser) > -1;
  }
}

function _isIE11() {
  let iev = 0;
  const ieold = (/MSIE (\d+\.\d+);/.test(navigator.userAgent));
  const trident = !!navigator.userAgent.match(/Trident\/7.0/);
  const rv = navigator.userAgent.indexOf('rv:11.0');

  if (ieold) {
      iev = Number(RegExp.$1);
  }
  if (navigator.appVersion.indexOf('MSIE 10') !== -1) {
      iev = 10;
  }
  if (trident && rv !== -1) {
      iev = 11;
  }

  return iev === 11;
}

function _isEdge() {
  return /Edge/.test(navigator.userAgent);
}

function _getDownloadUrl(text: any) {
  const BOM = '\uFEFF';
  // Add BOM to text for open in excel correctly
  if (window.Blob && window.URL && window.URL.createObjectURL) {
      const csvData = new Blob([BOM + text], { type: 'text/csv' });
      return URL.createObjectURL(csvData);
  } else {
      return 'data:attachment/csv;charset=utf-8,' + BOM + encodeURIComponent(text);
  }
}

function download(filename: any, text: any) {
  if (has('ie') && has('ie') < 10) {
    // has module unable identify ie11 and Edge
    const oWin = window.top.open('about:blank', '_blank');
    if (oWin) {
      (oWin.document as any).charset = 'utf-8';
      oWin.document.write(text);
      oWin.document.close();
      oWin.document.execCommand('SaveAs', filename);
      oWin.close();
    }
  } else if (has('ie') === 10 || _isIE11() || _isEdge()) {
    const BOM = '\uFEFF';
    const csvData = new Blob([BOM + text], { type: 'text/csv' });
    navigator.msSaveBlob(csvData, filename);
  } else {
    const link = document.createElement('a');
    link.download = filename;
    link.href = _getDownloadUrl(text);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

interface ExportCsvParams {
  filename?: string; // 文件名
  original?: boolean; // 是否导出为原始数据，默认为 true
  noHeader?: boolean; // 不显示表头，默认为 false
  columns: any[]; // 自定义导出的列数据
  data: any[]; // 自定义导出的行数据
  separator?: string; // 数据分隔符，默认是逗号(,)
  quoted?: boolean; // 每项数据是否加引号，默认为 false
  callback?(params: any): any; // 添加此函数后，不会下载，而是返回数据
}

export default function exportCsv(params: ExportCsvParams) {
  if (params.filename) {
    if (params.filename.indexOf('.csv') === -1) {
      params.filename += '.csv';
    }
  } else {
    params.filename = 'table.csv';
  }

  let columns = [];
  let datas = [];
  if (params.columns && params.data) {
    columns = params.columns;
    datas = params.data;
  } else {
    console.log('请传入参数columns和data!');
    return false;
  }

  let noHeader: boolean | undefined = false;
  if ('noHeader' in params) {
    noHeader = params.noHeader;
  }

  const data = csv(columns, datas, params, noHeader);
  if (params.callback) {
    params.callback(data);
  } else {
    download(params.filename, data);
  }
}