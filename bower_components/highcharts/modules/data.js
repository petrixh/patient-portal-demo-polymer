!function(e){"object"==typeof module&&module.exports?module.exports=e:e(Highcharts)}(function(e){var t,s=e.win.document,r=e.each,n=e.pick,i=e.inArray,o=e.isNumber,a=e.splat,l=function(e,t){this.init(e,t)};e.extend(l.prototype,{init:function(e,t){this.options=e,this.chartOptions=t,this.columns=e.columns||this.rowsToColumns(e.rows)||[],this.firstRowAsNames=n(e.firstRowAsNames,!0),this.decimalRegex=e.decimalPoint&&RegExp("^(-?[0-9]+)"+e.decimalPoint+"([0-9]+)$"),this.rawColumns=[],this.columns.length?this.dataFound():(this.parseCSV(),this.parseTable(),this.parseGoogleSpreadsheet())},getColumnDistribution:function(){var s,n=this.chartOptions,i=this.options,o=[],a=function(t){return(e.seriesTypes[t||"line"].prototype.pointArrayMap||[0]).length},l=n&&n.chart&&n.chart.type,u=[],h=[],m=0;r(n&&n.series||[],function(e){u.push(a(e.type||l))}),r(i&&i.seriesMapping||[],function(e){o.push(e.x||0)}),0===o.length&&o.push(0),r(i&&i.seriesMapping||[],function(r){var i,o=new t,d=u[m]||a(l),p=e.seriesTypes[((n&&n.series||[])[m]||{}).type||l||"line"].prototype.pointArrayMap||["y"];o.addColumnReader(r.x,"x");for(i in r)r.hasOwnProperty(i)&&"x"!==i&&o.addColumnReader(r[i],i);for(s=0;s<d;s++)o.hasReader(p[s])||o.addColumnReader(void 0,p[s]);h.push(o),m++}),i=e.seriesTypes[l||"line"].prototype.pointArrayMap,void 0===i&&(i=["y"]),this.valueCount={global:a(l),xColumns:o,individual:u,seriesBuilders:h,globalPointArrayMap:i}},dataFound:function(){this.options.switchRowsAndColumns&&(this.columns=this.rowsToColumns(this.columns)),this.getColumnDistribution(),this.parseTypes(),this.parsed()!==!1&&this.complete()},parseCSV:function(){var e,t,s=this,n=this.options,i=n.csv,o=this.columns,a=n.startRow||0,l=n.endRow||Number.MAX_VALUE,u=n.startColumn||0,h=n.endColumn||Number.MAX_VALUE,m=0;i&&(t=i.replace(/\r\n/g,"\n").replace(/\r/g,"\n").split(n.lineDelimiter||"\n"),e=n.itemDelimiter||(i.indexOf("\t")!==-1?"\t":","),r(t,function(t,n){var i=s.trim(t),d=0===i.indexOf("#");n>=a&&n<=l&&!d&&""!==i&&(i=t.split(e),r(i,function(e,t){t>=u&&t<=h&&(o[t-u]||(o[t-u]=[]),o[t-u][m]=e)}),m+=1)}),this.dataFound())},parseTable:function(){var e=this.options,t=e.table,n=this.columns,i=e.startRow||0,o=e.endRow||Number.MAX_VALUE,a=e.startColumn||0,l=e.endColumn||Number.MAX_VALUE;t&&("string"==typeof t&&(t=s.getElementById(t)),r(t.getElementsByTagName("tr"),function(e,t){t>=i&&t<=o&&r(e.children,function(e,s){("TD"===e.tagName||"TH"===e.tagName)&&s>=a&&s<=l&&(n[s-a]||(n[s-a]=[]),n[s-a][t-i]=e.innerHTML)})}),this.dataFound())},parseGoogleSpreadsheet:function(){var e,t,s=this,n=this.options,i=n.googleSpreadsheetKey,o=this.columns,a=n.startRow||0,l=n.endRow||Number.MAX_VALUE,u=n.startColumn||0,h=n.endColumn||Number.MAX_VALUE;i&&jQuery.ajax({dataType:"json",url:"https://spreadsheets.google.com/feeds/cells/"+i+"/"+(n.googleSpreadsheetWorksheet||"od6")+"/public/values?alt=json-in-script&callback=?",error:n.error,success:function(n){var i,m,n=n.feed.entry,d=n.length,p=0,c=0;for(m=0;m<d;m++)i=n[m],p=Math.max(p,i.gs$cell.col),c=Math.max(c,i.gs$cell.row);for(m=0;m<p;m++)m>=u&&m<=h&&(o[m-u]=[],o[m-u].length=Math.min(c,l-a));for(m=0;m<d;m++)i=n[m],e=i.gs$cell.row-1,t=i.gs$cell.col-1,t>=u&&t<=h&&e>=a&&e<=l&&(o[t-u][e-a]=i.content.$t);r(o,function(e){for(m=0;m<e.length;m++)void 0===e[m]&&(e[m]=null)}),s.dataFound()}})},trim:function(e,t){return"string"==typeof e&&(e=e.replace(/^\s+|\s+$/g,""),t&&/^[0-9\s]+$/.test(e)&&(e=e.replace(/\s/g,"")),this.decimalRegex&&(e=e.replace(this.decimalRegex,"$1.$2"))),e},parseTypes:function(){for(var e=this.columns,t=e.length;t--;)this.parseColumn(e[t],t)},parseColumn:function(e,t){var s,r,n,l,u,h=this.rawColumns,m=this.columns,d=e.length,p=this.firstRowAsNames,c=i(t,this.valueCount.xColumns)!==-1,f=[],g=this.chartOptions,v=(this.options.columnTypes||[])[t],g=c&&(g&&g.xAxis&&"category"===a(g.xAxis)[0].type||"string"===v);for(h[t]||(h[t]=[]);d--;)s=f[d]||e[d],n=this.trim(s),l=this.trim(s,!0),r=parseFloat(l),void 0===h[t][d]&&(h[t][d]=n),g||0===d&&p?e[d]=n:+l===r?(e[d]=r,r>31536e6&&"float"!==v?e.isDatetime=!0:e.isNumeric=!0,void 0!==e[d+1]&&(u=r>e[d+1])):(r=this.parseDate(s),c&&o(r)&&"float"!==v?(f[d]=s,e[d]=r,e.isDatetime=!0,void 0!==e[d+1]&&(s=r>e[d+1],s!==u&&void 0!==u&&(this.alternativeFormat?(this.dateFormat=this.alternativeFormat,d=e.length,this.alternativeFormat=this.dateFormats[this.dateFormat].alternative):e.unsorted=!0),u=s)):(e[d]=""===n?null:n,0!==d&&(e.isDatetime||e.isNumeric)&&(e.mixed=!0)));if(c&&e.mixed&&(m[t]=h[t]),c&&u&&this.options.sort)for(t=0;t<m.length;t++)m[t].reverse(),p&&m[t].unshift(m[t].pop())},dateFormats:{"YYYY-mm-dd":{regex:/^([0-9]{4})[\-\/\.]([0-9]{2})[\-\/\.]([0-9]{2})$/,parser:function(e){return Date.UTC(+e[1],e[2]-1,+e[3])}},"dd/mm/YYYY":{regex:/^([0-9]{1,2})[\-\/\.]([0-9]{1,2})[\-\/\.]([0-9]{4})$/,parser:function(e){return Date.UTC(+e[3],e[2]-1,+e[1])},alternative:"mm/dd/YYYY"},"mm/dd/YYYY":{regex:/^([0-9]{1,2})[\-\/\.]([0-9]{1,2})[\-\/\.]([0-9]{4})$/,parser:function(e){return Date.UTC(+e[3],e[1]-1,+e[2])}},"dd/mm/YY":{regex:/^([0-9]{1,2})[\-\/\.]([0-9]{1,2})[\-\/\.]([0-9]{2})$/,parser:function(e){return Date.UTC(+e[3]+2e3,e[2]-1,+e[1])},alternative:"mm/dd/YY"},"mm/dd/YY":{regex:/^([0-9]{1,2})[\-\/\.]([0-9]{1,2})[\-\/\.]([0-9]{2})$/,parser:function(e){return Date.UTC(+e[3]+2e3,e[1]-1,+e[2])}}},parseDate:function(e){var t,s,r,n=this.options.parseDate,i=this.options.dateFormat||this.dateFormat;if(n)t=n(e);else if("string"==typeof e){if(i)n=this.dateFormats[i],(r=e.match(n.regex))&&(t=n.parser(r));else for(s in this.dateFormats)if(n=this.dateFormats[s],r=e.match(n.regex)){this.dateFormat=s,this.alternativeFormat=n.alternative,t=n.parser(r);break}r||(r=Date.parse(e),"object"==typeof r&&null!==r&&r.getTime?t=r.getTime()-6e4*r.getTimezoneOffset():o(r)&&(t=r-6e4*new Date(r).getTimezoneOffset()))}return t},rowsToColumns:function(e){var t,s,r,n,i;if(e)for(i=[],s=e.length,t=0;t<s;t++)for(n=e[t].length,r=0;r<n;r++)i[r]||(i[r]=[]),i[r][t]=e[t][r];return i},parsed:function(){if(this.options.parsed)return this.options.parsed.call(this,this.columns)},getFreeIndexes:function(e,t){var s,r,n,i=[],o=[];for(r=0;r<e;r+=1)i.push(!0);for(s=0;s<t.length;s+=1)for(n=t[s].getReferencedColumnIndexes(),r=0;r<n.length;r+=1)i[n[r]]=!1;for(r=0;r<i.length;r+=1)i[r]&&o.push(r);return o},complete:function(){var e,s,r,n,o,a,l=this.columns,u=this.options,h=[];if(u.complete||u.afterComplete){for(n=0;n<l.length;n++)this.firstRowAsNames&&(l[n].name=l[n].shift());for(s=[],r=this.getFreeIndexes(l.length,this.valueCount.seriesBuilders),n=0;n<this.valueCount.seriesBuilders.length;n++)a=this.valueCount.seriesBuilders[n],a.populateColumns(r)&&h.push(a);for(;r.length>0;){for(a=new t,a.addColumnReader(0,"x"),n=i(0,r),n!==-1&&r.splice(n,1),n=0;n<this.valueCount.global;n++)a.addColumnReader(void 0,this.valueCount.globalPointArrayMap[n]);a.populateColumns(r)&&h.push(a)}if(h.length>0&&h[0].readers.length>0&&(a=l[h[0].readers[0].columnIndex],void 0!==a&&(a.isDatetime?e="datetime":a.isNumeric||(e="category"))),"category"===e)for(n=0;n<h.length;n++)for(a=h[n],r=0;r<a.readers.length;r++)"x"===a.readers[r].configName&&(a.readers[r].configName="name");for(n=0;n<h.length;n++){for(a=h[n],r=[],o=0;o<l[0].length;o++)r[o]=a.read(l,o);s[n]={data:r},a.name&&(s[n].name=a.name),"category"===e&&(s[n].turboThreshold=0)}l={series:s},e&&(l.xAxis={type:e}),u.complete&&u.complete(l),u.afterComplete&&u.afterComplete(l)}}}),e.Data=l,e.data=function(e,t){return new l(e,t)},e.wrap(e.Chart.prototype,"init",function(t,s,r){var n=this;s&&s.data?e.data(e.extend(s.data,{afterComplete:function(i){var o,a;if(s.hasOwnProperty("series"))if("object"==typeof s.series)for(o=Math.max(s.series.length,i.series.length);o--;)a=s.series[o]||{},s.series[o]=e.merge(a,i.series[o]);else delete s.series;s=e.merge(i,s),t.call(n,s,r)}}),s):t.call(n,s,r)}),t=function(){this.readers=[],this.pointIsArray=!0},t.prototype.populateColumns=function(e){var t=!0;return r(this.readers,function(t){void 0===t.columnIndex&&(t.columnIndex=e.shift())}),r(this.readers,function(e){void 0===e.columnIndex&&(t=!1)}),t},t.prototype.read=function(e,t){var s,n=this.pointIsArray,i=n?[]:{};return r(this.readers,function(s){var r=e[s.columnIndex][t];n?i.push(r):i[s.configName]=r}),void 0===this.name&&this.readers.length>=2&&(s=this.getReferencedColumnIndexes(),s.length>=2)&&(s.shift(),s.sort(),this.name=e[s.shift()].name),i},t.prototype.addColumnReader=function(e,t){this.readers.push({columnIndex:e,configName:t}),"x"!==t&&"y"!==t&&void 0!==t&&(this.pointIsArray=!1)},t.prototype.getReferencedColumnIndexes=function(){var e,t,s=[];for(e=0;e<this.readers.length;e+=1)t=this.readers[e],void 0!==t.columnIndex&&s.push(t.columnIndex);return s},t.prototype.hasReader=function(e){var t,s;for(t=0;t<this.readers.length;t+=1)if(s=this.readers[t],s.configName===e)return!0}});