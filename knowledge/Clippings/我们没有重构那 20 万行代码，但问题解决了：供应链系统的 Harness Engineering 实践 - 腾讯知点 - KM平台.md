---
title: "我们没有重构那 20 万行代码，但问题解决了：供应链系统的 Harness Engineering 实践 - 腾讯知点 - KM平台"
source: "https://km.woa.com/articles/show/662361"
author:
published:
created: 2026-06-09
description:
tags:
  - "clippings"
---
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="position: absolute; width: 0; height: 0" aria-hidden="true" id="__SVG_SPRITE_NODE__"><symbol xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 9 14" id="svgicon-common-arrow"><g id="svgicon-common-arrow__x30_603-积分证书_x2F_个人中心"><g id="svgicon-common-arrow_签到方案" transform="translate(-1381.000000, -430.000000)"><g id="svgicon-common-arrow_Group-5-Copy-2" transform="translate(1381.000000, 430.000000)"><g id="svgicon-common-arrow_箭头-2"><g id="svgicon-common-arrow_箭头"><rect id="svgicon-common-arrow_Rectangle" width="8.8" height="14" fill="none" stroke="currentColor"></rect><path id="svgicon-common-arrow_Path" d="M7.4,7.3l-4.9,4.9c-0.2,0.2-0.4,0.2-0.6,0l-0.6-0.6c-0.2-0.2-0.2-0.4,0-0.6l4-4l-4-4c-0.2-0.2-0.2-0.4,0-0.6       l0.6-0.6c0.2-0.2,0.4-0.2,0.6,0l4.9,4.9C7.6,6.9,7.6,7.1,7.4,7.3z"></path></g></g></g></g></g></symbol><symbol xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" id="svgicon-common-create"><g id="svgicon-common-create__x30_603-积分证书_x2F_个人中心"><g id="svgicon-common-create_签到方案" transform="translate(-1376.000000, -237.000000)"><g id="svgicon-common-create_创建-copy-2" transform="translate(1376.000000, 237.000000)"><rect id="svgicon-common-create_Rectangle" width="24" height="24" fill="none" stroke="currentColor"></rect><g id="svgicon-common-create_edit-box-line" transform="translate(3.000000, 2.000000)"><path id="svgicon-common-create_Combined-Shape" d="M7.5,4H2v13h13v-5.5l2-2V18c0,0.6-0.4,1-1,1H1c-0.6,0-1-0.4-1-1V3c0-0.6,0.4-1,1-1h8.5L7.5,4z       M8.4,12l7.3-7.3l-1.4-1.4L7,10.6V12H8.4z M9.2,14H5V9.8l8.6-8.6c0.4-0.4,1-0.4,1.4,0L17.8,4c0.4,0.4,0.4,1,0,1.4L9.2,14z"></path></g></g></g></g></symbol><symbol xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" id="svgicon-common-notifications"><g id="svgicon-common-notifications__x30_603-积分证书_x2F_个人中心"><g id="svgicon-common-notifications_签到方案" transform="translate(-1376.000000, -316.000000)"><g id="svgicon-common-notifications_Group-15-Copy-2" transform="translate(1376.000000, 316.000000)"><g id="svgicon-common-notifications_消息提醒-2"><g id="svgicon-common-notifications_消息提醒" transform="translate(3.000000, 2.000000)"><path id="svgicon-common-notifications_Combined-Shape" d="M2,13V8.5C2,5,4.6,2.1,8,1.6V0.5C8,0.2,8.2,0,8.5,0h1C9.8,0,10,0.2,10,0.5v1.1       c3.4,0.5,6,3.4,6,6.9V13h1c0.3,0,0.5,0.2,0.5,0.5v1c0,0.3-0.2,0.5-0.5,0.5H1c-0.3,0-0.5-0.2-0.5-0.5v-1C0.5,13.2,0.7,13,1,13H2       z M4,13h10V8.5c0-2.8-2.2-5-5-5s-5,2.2-5,5V13z M11,16h2c0,2.2-1.8,4-4,4s-4-1.8-4-4h2c0,1.1,0.9,2,2,2S11,17.1,11,16z"></path></g></g></g></g></g></symbol><symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 17" fill="none" id="svgicon-common-new-ai-chat"><path d="M14.0347 5.34681L13.8502 5.77131C13.8214 5.84044 13.7728 5.89948 13.7104 5.94102C13.6481 5.98255 13.5749 6.00471 13.5 6.00471C13.4251 6.00471 13.3519 5.98255 13.2896 5.94102C13.2272 5.89948 13.1786 5.84044 13.1498 5.77131L12.9653 5.34681C12.6409 4.59585 12.0468 3.99375 11.3002 3.65931L10.731 3.40506C10.6619 3.37329 10.6034 3.32239 10.5624 3.25838C10.5214 3.19438 10.4996 3.11995 10.4996 3.04394C10.4996 2.96792 10.5214 2.8935 10.5624 2.82949C10.6034 2.76548 10.6619 2.71458 10.731 2.68281L11.2687 2.44356C12.0341 2.0996 12.6383 1.47522 12.957 0.699061L13.1467 0.240811C13.1746 0.169826 13.2232 0.108884 13.2862 0.0659296C13.3492 0.0229749 13.4237 0 13.5 0C13.5763 0 13.6508 0.0229749 13.7138 0.0659296C13.7768 0.108884 13.8254 0.169826 13.8533 0.240811L14.043 0.698311C14.3614 1.47462 14.9653 2.09926 15.7305 2.44356L16.269 2.68356C16.3379 2.71542 16.3961 2.76632 16.437 2.83024C16.4779 2.89417 16.4996 2.96845 16.4996 3.04431C16.4996 3.12018 16.4779 3.19446 16.437 3.25838C16.3961 3.3223 16.3379 3.3732 16.269 3.40506L15.699 3.65856C14.9526 3.99334 14.3588 4.59571 14.0347 5.34681ZM6 1.50081H9V3.00081H6C4.80653 3.00081 3.66193 3.47492 2.81802 4.31883C1.97411 5.16274 1.5 6.30734 1.5 7.50081C1.5 10.2083 3.3465 11.9753 7.5 13.8608V12.0008H9C10.1935 12.0008 11.3381 11.5267 12.182 10.6828C13.0259 9.83888 13.5 8.69429 13.5 7.50081H15C15 9.09211 14.3679 10.6182 13.2426 11.7435C12.1174 12.8687 10.5913 13.5008 9 13.5008V16.1258C5.25 14.6258 0 12.3758 0 7.50081C0 5.90951 0.632141 4.38339 1.75736 3.25817C2.88258 2.13295 4.4087 1.50081 6 1.50081Z" fill="#008DFC" style="fill:#008DFC;fill:color(display-p3 0.0000 0.5529 0.9882);fill-opacity:1;"></path></symbol><symbol xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 28 28" id="svgicon-common-qr-icon"><g id="svgicon-common-qr-icon_首页_x2F_话题榜_x2F_最新列表"><g id="svgicon-common-qr-icon_画板" transform="translate(-1496.000000, -571.000000)"><g id="svgicon-common-qr-icon_二维码备份-3" transform="translate(1482.000000, 557.000000)"><g id="svgicon-common-qr-icon_编组"><path id="svgicon-common-qr-icon_形状结合" d="M24.4,29.6c1.1,0,2,0.9,2,2V40c0,1.1-0.9,2-2,2H16c-1.1,0-2-0.9-2-2v-8.4      c0-1.1,0.9-2,2-2H24.4z M33,42h-3v-3h3v-6h3v6l3,0v-3h3v4c0,1.1-0.9,2-2,2l0,0h-4v-3h-3V42z M21.8,33.2h-3.2c-0.6,0-1,0.4-1,1      v3.2c0,0.6,0.4,1,1,1h3.2c0.6,0,1-0.4,1-1v-3.2C22.8,33.6,22.4,33.2,21.8,33.2z M42,30v3h-3v-3H42z M33,30v3h-3v-3H33z M24.4,14      c1.1,0,2,0.9,2,2v8.4c0,1.1-0.9,2-2,2H16c-1.1,0-2-0.9-2-2V16c0-1.1,0.9-2,2-2H24.4z M40,14c1.1,0,2,0.9,2,2v8.4      c0,1.1-0.9,2-2,2h-8.4c-1.1,0-2-0.9-2-2V16c0-1.1,0.9-2,2-2H40z M21.8,17.6h-3.2c-0.6,0-1,0.4-1,1v3.2c0,0.6,0.4,1,1,1h3.2      c0.6,0,1-0.4,1-1v-3.2C22.8,18.1,22.4,17.6,21.8,17.6z M37.4,17.6h-3.2c-0.6,0-1,0.4-1,1v3.2c0,0.6,0.4,1,1,1h3.2      c0.6,0,1-0.4,1-1v-3.2C38.4,18.1,37.9,17.6,37.4,17.6z" fill="none"></path></g></g></g></g></symbol><symbol xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 28 28" id="svgicon-common-top-icon"><g id="svgicon-common-top-icon_首页_x2F_话题榜_x2F_最新列表"><g id="svgicon-common-top-icon_画板" transform="translate(-1496.000000, -652.000000)"><g id="svgicon-common-top-icon_置顶备份-2" transform="translate(1482.000000, 638.000000)"><g id="svgicon-common-top-icon_编组-2"><path id="svgicon-common-top-icon_形状" d="M29.2,19.5l-0.1-0.1c-0.3-0.3-0.6-0.4-1-0.4c-0.4,0-0.7,0.2-0.9,0.5l-9.9,12.4l0,0      c-0.3,0.4-0.3,1,0.1,1.4c0.2,0.1,0.4,0.2,0.6,0.2c0.4,0,0.7,0,0.8,0l5.4-0.1v7c0,0.9,0.7,1.6,1.6,1.6l0,0h4.5l0,0      c0.9,0,1.6-0.7,1.6-1.6v-7l0,0l5.3,0.1c0.3,0,0.6,0,1,0c0.5,0,0.9-0.4,0.9-0.9c0-0.2-0.1-0.5-0.3-0.7l0,0l0,0L29.2,19.5z       M37.4,14H18.8c-0.4,0-0.8,0.3-1,0.8s-0.2,1,0,1.5s0.6,0.8,1,0.8h18.7c0.4,0,0.8-0.3,1-0.8s0.2-1,0-1.5S37.9,14,37.4,14z" fill="none"></path></g></g></g></g></symbol><symbol xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 16 16" id="svgicon-operation-view"><title>浏览量/默认</title> <g id="svgicon-operation-view_1129文章阅读" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="svgicon-operation-view_1129-文章内容" transform="translate(-1245.000000, -484.000000)" stroke="#999999"><g id="svgicon-operation-view_编组-65" transform="translate(730.000000, 380.000000)"><g id="svgicon-operation-view_编组-32" transform="translate(194.000000, 67.000000)"><g id="svgicon-operation-view_编组-4" transform="translate(321.000000, 37.000000)"><g id="svgicon-operation-view_编组-3" transform="translate(1.600000, 2.400000)"><ellipse id="svgicon-operation-view_椭圆形" cx="6.4" cy="6" rx="6.4" ry="4.8"></ellipse><path d="M6.4,8 C7.5045695,8 8.4,7.1045695 8.4,6 C8.4,4.8954305 7.5045695,4 6.4,4 C5.2954305,4 4.4,4.8954305 4.4,6 C4.4,7.1045695 5.2954305,8 6.4,8 Z" id="svgicon-operation-view_椭圆形"></path><line x1="6.4" y1="1.2" x2="6.4" y2="0" id="svgicon-operation-view_路径-15" stroke-linecap="round" stroke-linejoin="round"></line><line x1="9.88558962" y1="1.74690866" x2="10.4" y2="0.8" id="svgicon-operation-view_路径-15备份" stroke-linecap="round" stroke-linejoin="round"></line><line x1="2.4" y1="1.72351617" x2="2.91294853" y2="0.8" id="svgicon-operation-view_路径-15备份-2" stroke-linecap="round" stroke-linejoin="round" transform="translate(2.656474, 1.261758) scale(-1, 1) translate(-2.656474, -1.261758) "></line></g></g></g></g></g></g></symbol><symbol xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 16 16" id="svgicon-operation-share"><title>分享/默认@2x</title> <g id="svgicon-operation-share_1227-知识奖" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"><g id="svgicon-operation-share_1227-文章-知识奖备份" transform="translate(-1370.000000, -484.000000)" stroke="#999999" stroke-width="0.8"><g id="svgicon-operation-share_编组-65" transform="translate(730.000000, 380.000000)"><g id="svgicon-operation-share_编组-16备份" transform="translate(634.000000, 100.000000)"><g id="svgicon-operation-share_编组-2备份-2" transform="translate(6.000000, 4.000000)"><g id="svgicon-operation-share_编组" transform="translate(1.750634, 2.000000)"><path d="M6.64936572,0 L12.4893657,6 L6.64936572,12 L6.64936572,8 C2.05449392,8 0.00936571566,11.2 0.00936571566,11.2 C-0.150634284,7.6 1.72628879,3.6 6.64936572,3.6 L6.64936572,0 Z" id="svgicon-operation-share_路径"></path></g></g></g></g></g></g></symbol><symbol xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16" id="svgicon-common-screen-l"><rect x="2.4" y="3.20001" width="11.2" height="9.6" rx=".8" stroke="color(display-p3 0 .5529 .9882)" stroke-width=".8"></rect><path d="M6.8 5.60001H4.8V7.60001" stroke="color(display-p3 0 .5529 .9882)" stroke-width=".8" stroke-linecap="round" stroke-linejoin="round"></path><path d="M11.2 8.39999V10.4H9.2" stroke="color(display-p3 0 .5529 .9882)" stroke-width=".8" stroke-linecap="round" stroke-linejoin="round"></path></symbol><symbol xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" id="svgicon-operation-big-digg"><title>顶</title> <g id="svgicon-operation-big-digg_1129文章阅读" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"><g id="svgicon-operation-big-digg_1129-文章内容" transform="translate(-1562.000000, -1169.000000)" stroke="#333333" stroke-width="1.2"><g id="svgicon-operation-big-digg_编组-32备份" transform="translate(1550.000000, 1155.000000)"><g id="svgicon-operation-big-digg_点赞" transform="translate(12.000000, 14.000000)"><line x1="8.4" y1="20.4" x2="8.4" y2="10.8" id="svgicon-operation-big-digg_路径-51"></line><path d="M8.4,10.8 L5.27999997,10.8 C4.35216161,10.8 3.6,11.5521616 3.6,12.48 L3.6,18.72 C3.6,19.6478384 4.35216161,20.4 5.27999997,20.4 L8.4,20.4 L8.4,20.4 L17.5834475,20.4 C18.1700545,20.4 18.6706826,19.9759043 18.7671202,19.3972788 L20.0972562,11.4164625 C20.2388965,10.5666208 19.6647858,9.76286577 18.8149441,9.62122548 C18.730187,9.60709931 18.6444078,9.6 18.5584816,9.6 L13.8,9.6 L13.8,9.6 L13.8,6.16752937 C13.8,5.02349492 12.9924968,4.03849936 11.8706787,3.81413574 L10.8,3.6 L10.8,3.6 L8.4,10.8 Z" id="svgicon-operation-big-digg_路径-50"></path></g></g></g></g></symbol><symbol xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 28 28" id="svgicon-operation-big-share"><title>分享/打</title> <g id="svgicon-operation-big-share_1227-知识奖" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"><g id="svgicon-operation-big-share_1227-文章-知识奖备份" transform="translate(-1212.000000, -2045.000000)" stroke="#333333" stroke-width="1.4"><g id="svgicon-operation-big-share_编组-25" transform="translate(874.000000, 1751.000000)"><g id="svgicon-operation-big-share_编组-16" transform="translate(91.000000, 280.000000)"><g id="svgicon-operation-big-share_编组-10备份" transform="translate(233.000000, 0.000000)"><g id="svgicon-operation-big-share_编组-38" transform="translate(14.000000, 14.000000)"><g id="svgicon-operation-big-share_编组" transform="translate(4.200000, 4.900000)"><path d="M10.435083,0 L19.6,9.1 L10.435083,18.2 L10.435083,12.1333333 C3.22418942,12.1333333 0.0146979463,16.9866667 0.0146979463,16.9866667 C-0.23639567,11.5266667 2.7091256,5.46 10.435083,5.46 L10.435083,0 Z" id="svgicon-operation-big-share_路径"></path></g></g></g></g></g></g></g></symbol><symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" id="svgicon-entry-close"><path d="M0.146446609,0.146446609 C0.341708755,-0.0488155365 0.658291245,-0.0488155365 0.853553391,0.146446609 L4.742,4.036 L8.63172798,0.146446609 C8.80529434,-0.0271197425 9.07471874,-0.0464048927 9.26958688,0.0885911588 L9.33883476,0.146446609 C9.53409691,0.341708755 9.53409691,0.658291245 9.33883476,0.853553391 L5.449,4.742 L9.33883476,8.63172798 C9.51240112,8.80529434 9.53168627,9.07471874 9.39669022,9.26958688 L9.33883476,9.33883476 C9.14357262,9.53409691 8.82699013,9.53409691 8.63172798,9.33883476 L4.742,5.449 L0.853553391,9.33883476 C0.679987039,9.51240112 0.410562638,9.53168627 0.215694497,9.39669022 L0.146446609,9.33883476 C-0.0488155365,9.14357262 -0.0488155365,8.82699013 0.146446609,8.63172798 L4.036,4.742 L0.146446609,0.853553391 C-0.0271197425,0.679987039 -0.0464048927,0.410562638 0.0885911588,0.215694497 L0.146446609,0.146446609 Z" transform="translate(3.257359 3.257359)" fill-rule="nonzero"></path></symbol><symbol xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 20 20" id="svgicon-operation-reship"><title>转载</title> <g id="svgicon-operation-reship_1129文章阅读" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"><g id="svgicon-operation-reship_1129-文章内容" transform="translate(-802.000000, -2173.000000)" stroke="#999999"><g id="svgicon-operation-reship_编组-27" transform="translate(730.000000, 2173.000000)"><g id="svgicon-operation-reship_转载" transform="translate(72.000000, 0.000000)"><path d="M4.5,3 L15.5,3 C16.0522847,3 16.5,3.44771525 16.5,4 L16.5,16 C16.5,16.5522847 16.0522847,17 15.5,17 L4.5,17 C3.94771525,17 3.5,16.5522847 3.5,16 L3.5,4 C3.5,3.44771525 3.94771525,3 4.5,3 Z" id="svgicon-operation-reship_矩形"></path><path d="M12,7 L13,8 L9.5,8 C8.11928813,8 7,9.11928813 7,10.5 C7,11.8807119 8.11928813,13 9.5,13 L13,13 L13,13" id="svgicon-operation-reship_路径-8"></path><line x1="13" y1="8" x2="12" y2="9" id="svgicon-operation-reship_路径-11"></line></g></g></g></g></symbol><symbol xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 20 20" id="svgicon-operation-collect"><title>收录</title> <g id="svgicon-operation-collect_1129文章阅读" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="svgicon-operation-collect_1129-文章内容" transform="translate(-874.000000, -2173.000000)" stroke="#999999"><g id="svgicon-operation-collect_编组-27" transform="translate(730.000000, 2173.000000)"><g id="svgicon-operation-collect_文件夹" transform="translate(144.000000, 0.000000)"><path d="M4,3 L7.73682702,3 C7.88521694,3 8.02594075,3.0659115 8.12093766,3.1799078 L9.74637681,5.13043478 L9.74637681,5.13043478 L16,5.13043478 C16.5522847,5.13043478 17,5.57815003 17,6.13043478 L17,16 C17,16.5522847 16.5522847,17 16,17 L4,17 C3.44771525,17 3,16.5522847 3,16 L3,4 C3,3.44771525 3.44771525,3 4,3 Z" id="svgicon-operation-collect_路径" stroke-linejoin="round"></path><line x1="7.61594203" y1="13.4565217" x2="11.8768116" y2="13.4565217" id="svgicon-operation-collect_路径" stroke-linecap="round"></line></g></g></g></g></symbol><symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" id="svgicon-kbar-load_btn"><g fill="none" fill-rule="evenodd"><path stroke="#666" stroke-linecap="round" stroke-linejoin="round" d="M3 5.5L8 10.5000004 13 5.5"></path></g></symbol><symbol xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" id="svgicon-operation-to-top"><title>回到顶部</title> <g id="svgicon-operation-to-top_1101文章头条+适配白底" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"><g id="svgicon-operation-to-top_点赞+收藏+评论位置" transform="translate(-1242.000000, -1298.000000)" stroke="#333333" stroke-width="1.4"><g id="svgicon-operation-to-top_编组-32备份" transform="translate(1230.000000, 1080.000000)"><g id="svgicon-operation-to-top_编组-10备份-4" transform="translate(0.000000, 206.000000)"><g id="svgicon-operation-to-top_编组-36" transform="translate(12.000000, 12.000000)"><g id="svgicon-operation-to-top_编组" transform="translate(12.000000, 12.000000) scale(1, -1) translate(-12.000000, -12.000000) translate(4.200000, 3.600000)"><polygon id="svgicon-operation-to-top_路径" points="0 8.4 7.8 16.8 15.6 8.4 10.8 8.4 10.8 0 4.8 0 4.8 8.4"></polygon></g></g></g></g></g></g></symbol><symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 16" id="svgicon-common-new-arrow"><path d="M0.146446609,0.146446609 C0.320012961,-0.0271197425 0.589437362,-0.0464048927 0.784305503,0.0885911588 L0.853553391,0.146446609 L5.5,4.793 L10.1464466,0.146446609 C10.320013,-0.0271197425 10.5894374,-0.0464048927 10.7843055,0.0885911588 L10.8535534,0.146446609 C11.0271197,0.320012961 11.0464049,0.589437362 10.9114088,0.784305503 L10.8535534,0.853553391 L5.85355339,5.85355339 C5.67998704,6.02711974 5.41056264,6.04640489 5.2156945,5.91140884 L5.14644661,5.85355339 L0.146446609,0.853553391 C-0.0488155365,0.658291245 -0.0488155365,0.341708755 0.146446609,0.146446609 Z" transform="rotate(-90 7.75 5.75)" fill-rule="nonzero"></path></symbol><symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" id="svgicon-common-arrow-double-right"><g stroke="currentColor" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"><path transform="rotate(-90 14.7 6)" d="M5.7 2.8L11.2 8.3 16.7 2.7"></path><path transform="rotate(-90 6.25 6)" d="M-2.75 2.75L2.75 8.25 8.25 2.75"></path></g></symbol><symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" id="svgicon-article-fullscreen"><path d="M4 4H10V6H7.41421L10.4142 9L9 10.4142L6 7.41421V10H4V4ZM14 4H20V10H18V7.41421L15 10.4142L13.5858 9L16.5858 6H14V4ZM10.4142 15L7.41421 18H10V20H4V14H6V16.5858L9 13.5858L10.4142 15ZM15 13.5858L18 16.5858V14H20V20H14V18H16.5858L13.5858 15L15 13.5858Z" fill="white"></path></symbol><symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" id="svgicon-common-face"><path d="M10,2 C14.418278,2 18,5.581722 18,10 C18,14.418278 14.418278,18 10,18 C5.581722,18 2,14.418278 2,10 C2,5.581722 5.581722,2 10,2 Z M10,3 C6.13400675,3 3,6.13400675 3,10 C3,13.8659932 6.13400675,17 10,17 C13.8659932,17 17,13.8659932 17,10 C17,6.13400675 13.8659932,3 10,3 Z M8.35355339,12.1464466 C9.26286074,13.055754 10.7371393,13.055754 11.6464466,12.1464466 C11.8417088,11.9511845 12.1582912,11.9511845 12.3535534,12.1464466 C12.5488155,12.3417088 12.5488155,12.6582912 12.3535534,12.8535534 C11.0537217,14.153385 8.94627825,14.153385 7.64644661,12.8535534 C7.45118446,12.6582912 7.45118446,12.3417088 7.64644661,12.1464466 C7.84170876,11.9511845 8.15829124,11.9511845 8.35355339,12.1464466 Z M7.5,7.5 C8.05228475,7.5 8.5,7.94771525 8.5,8.5 C8.5,9.05228475 8.05228475,9.5 7.5,9.5 C6.94771525,9.5 6.5,9.05228475 6.5,8.5 C6.5,7.94771525 6.94771525,7.5 7.5,7.5 Z M12.5,7.5 C13.0522847,7.5 13.5,7.94771525 13.5,8.5 C13.5,9.05228475 13.0522847,9.5 12.5,9.5 C11.9477153,9.5 11.5,9.05228475 11.5,8.5 C11.5,7.94771525 11.9477153,7.5 12.5,7.5 Z" fill-rule="nonzero"></path></symbol><symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" id="svgicon-common-picture"><path d="M15,2.5 C16.3254834,2.5 17.4100387,3.53153594 17.4946823,4.83562431 L17.5,5 L17.5,15 C17.5,16.3254834 16.4684641,17.4100387 15.1643757,17.4946823 L15,17.5 L5,17.5 C3.6745166,17.5 2.58996133,16.4684641 2.50531768,15.1643757 L2.5,15 L2.5,5 C2.5,3.6745166 3.53153594,2.58996133 4.83562431,2.50531768 L5,2.5 L15,2.5 Z M15,3.5 L5,3.5 C4.22030388,3.5 3.57955132,4.09488808 3.50686658,4.85553999 L3.5,5 L3.5,15 C3.5,15.7796961 4.09488808,16.4204487 4.85553999,16.4931334 L5,16.5 L7.742,16.5 L11.5998043,11.1000415 C12.2807851,10.1466683 13.5259364,9.80005812 14.5934672,10.244454 L14.752172,10.317069 L16.5,11.191 L16.5,5 C16.5,4.22030388 15.9051119,3.57955132 15.14446,3.50686658 L15,3.5 Z M12.5041647,11.5665442 L12.4135378,11.6812797 L8.97,16.5 L15,16.5 C15.7796961,16.5 16.4204487,15.9051119 16.4931334,15.14446 L16.5,15 L16.5,12.309 L14.3049584,11.2114962 C13.6887848,10.9034094 12.9488867,11.0564404 12.5041647,11.5665442 Z M7,6 C7.55228475,6 8,6.44771525 8,7 C8,7.55228475 7.55228475,8 7,8 C6.44771525,8 6,7.55228475 6,7 C6,6.44771525 6.44771525,6 7,6 Z" fill-rule="nonzero"></path></symbol><symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" id="svgicon-common-expand"><path d="M3,12.5 C3.24545989,12.5 3.44960837,12.6768752 3.49194433,12.9101244 L3.5,13 L3.5,15.792 L6.64644661,12.6464466 C6.84170876,12.4511845 7.15829124,12.4511845 7.35355339,12.6464466 C7.52711974,12.820013 7.54640489,13.0894374 7.41140884,13.2843055 L7.35355339,13.3535534 L4.206,16.5 L7,16.5 C7.27614237,16.5 7.5,16.7238576 7.5,17 C7.5,17.2454599 7.32312484,17.4496084 7.08987563,17.4919443 L7,17.5 L3.5,17.5 C2.98716416,17.5 2.56449284,17.1139598 2.50672773,16.6166211 L2.5,16.5 L2.5,13 C2.5,12.7238576 2.72385763,12.5 3,12.5 Z M16.5,2.5 C17.0128358,2.5 17.4355072,2.88604019 17.4932723,3.38337887 L17.5,3.5 L17.5,7 C17.5,7.27614237 17.2761424,7.5 17,7.5 C16.7545401,7.5 16.5503916,7.32312484 16.5080557,7.08987563 L16.5,7 L16.5,4.206 L13.3535534,7.35355339 C13.1582912,7.54881554 12.8417088,7.54881554 12.6464466,7.35355339 C12.4728803,7.17998704 12.4535951,6.91056264 12.5885912,6.7156945 L12.6464466,6.64644661 L15.792,3.5 L13,3.5 C12.7238576,3.5 12.5,3.27614237 12.5,3 C12.5,2.75454011 12.6768752,2.55039163 12.9101244,2.50805567 L13,2.5 L16.5,2.5 Z" fill-rule="nonzero"></path></symbol><symbol xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 20 20" id="svgicon-article-toc-collapse"><title>左侧收起</title> <g id="svgicon-article-toc-collapse_1101文章头条+适配白底" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="svgicon-article-toc-collapse_文章内容" transform="translate(-646.000000, -384.000000)"><g id="svgicon-article-toc-collapse_编组-22备份-3" transform="translate(390.000000, 380.000000)"><g id="svgicon-article-toc-collapse_编组-2" transform="translate(252.000000, 0.000000)"><g id="svgicon-article-toc-collapse_收起" transform="translate(4.000000, 4.000000)"><g id="svgicon-article-toc-collapse_收起" transform="translate(10.000000, 10.000000) scale(-1, 1) translate(-10.000000, -10.000000) "><g id="svgicon-article-toc-collapse_编组"></g><polyline id="svgicon-article-toc-collapse_路径-5备份" stroke="#333333" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" transform="translate(13.125000, 10.000000) rotate(-90.000000) translate(-13.125000, -10.000000) " points="9.375 8.125 13.125 11.8750003 16.875 8.125"></polyline><polyline id="svgicon-article-toc-collapse_路径-5备份-2" stroke="#333333" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" transform="translate(6.875000, 10.000000) rotate(-90.000000) translate(-6.875000, -10.000000) " points="3.125 8.125 6.875 11.8750003 10.625 8.125"></polyline></g></g></g></g></g></g></symbol><symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none" id="svgicon-article-hot"><path d="M15.9995 27.3729L17.5279 14.1272C17.5279 14.1272 18.8234 13.694 20.2183 12.4153C21.2021 11.5135 21.5981 10.1492 21.7461 9.42323C21.7928 9.19373 22.052 9.07093 22.229 9.22436C23.9998 10.7597 26.6956 15.8899 25.4228 21.0533C24.3843 25.2662 20.044 27.3335 15.9995 27.3729Z" fill="#F25555" style="fill:#F25555;fill:color(display-p3 0.9490 0.3333 0.3333);fill-opacity:1;"></path><path d="M10.8628 9.99682C12.585 7.45524 12.8868 4.99505 12.929 3.90874C12.9387 3.65666 13.209 3.48735 13.4229 3.6211C15.3717 4.83969 22.4114 9.88342 22.5509 19.2326C22.594 22.1221 21.3406 27.3805 15.69 27.3805C9.80884 27.3805 6.48374 23.2633 6.5503 19.003C6.61696 14.7355 8.43917 13.5736 10.8628 9.99682Z" fill="#F25555" style="fill:#F25555;fill:color(display-p3 0.9490 0.3333 0.3333);fill-opacity:1;"></path></symbol><symbol xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16" id="svgicon-article-article-abstract-disabled"><path d="M3.20001 3.2C3.20001 2.53726 3.73727 2 4.40001 2H11.6C12.2628 2 12.8 2.53726 12.8 3.2V8V12.8C12.8 13.4627 12.2628 14 11.6 14H4.40001C3.73727 14 3.20001 13.4627 3.20001 12.8V3.2Z" stroke="color(display-p3 .6 .6 .6)"></path><path d="M6.40002 11.6H9.60002" stroke="color(display-p3 .6 .6 .6)" stroke-linecap="round"></path><path d="M6.40002 9.19995H9.60002" stroke="color(display-p3 .6 .6 .6)" stroke-linecap="round"></path></symbol><symbol xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16" id="svgicon-article-mindmap-disabled"><path fill-rule="evenodd" clip-rule="evenodd" d="M5.09998 3.59998C5.09998 3.32383 5.32383 3.09998 5.59998 3.09998H10.8C11.9598 3.09998 12.9 4.04018 12.9 5.19998V5.99998C12.9 6.27612 12.6761 6.49998 12.4 6.49998C12.1238 6.49998 11.9 6.27612 11.9 5.99998V5.19998C11.9 4.59246 11.4075 4.09998 10.8 4.09998H5.59998C5.32383 4.09998 5.09998 3.87612 5.09998 3.59998Z" fill="color(display-p3 .6 .6 .6)"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M5.09998 12.4C5.09998 12.6762 5.32383 12.9 5.59998 12.9H10.8C11.9598 12.9 12.9 11.9598 12.9 10.8V10C12.9 9.72388 12.6761 9.50002 12.4 9.50002C12.1238 9.50002 11.9 9.72388 11.9 10V10.8C11.9 11.4075 11.4075 11.9 10.8 11.9H5.59998C5.32383 11.9 5.09998 12.1239 5.09998 12.4Z" fill="color(display-p3 .6 .6 .6)"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M3.59998 2.09998C2.77155 2.09998 2.09998 2.77155 2.09998 3.59998C2.09998 4.4284 2.77155 5.09998 3.59998 5.09998C4.4284 5.09998 5.09998 4.4284 5.09998 3.59998C5.09998 2.77155 4.4284 2.09998 3.59998 2.09998ZM1.09998 3.59998C1.09998 2.21926 2.21926 1.09998 3.59998 1.09998C4.98069 1.09998 6.09998 2.21926 6.09998 3.59998C6.09998 4.98069 4.98069 6.09998 3.59998 6.09998C2.21926 6.09998 1.09998 4.98069 1.09998 3.59998Z" fill="color(display-p3 .6 .6 .6)"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M12.4 6.5C11.5716 6.5 10.9 7.17157 10.9 8C10.9 8.82843 11.5716 9.5 12.4 9.5C13.2285 9.5 13.9 8.82843 13.9 8C13.9 7.17157 13.2285 6.5 12.4 6.5ZM9.90002 8C9.90002 6.61929 11.0193 5.5 12.4 5.5C13.7807 5.5 14.9 6.61929 14.9 8C14.9 9.38071 13.7807 10.5 12.4 10.5C11.0193 10.5 9.90002 9.38071 9.90002 8Z" fill="color(display-p3 .6 .6 .6)"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M3.59998 10.9C2.77155 10.9 2.09998 11.5716 2.09998 12.4C2.09998 13.2285 2.77155 13.9 3.59998 13.9C4.4284 13.9 5.09998 13.2285 5.09998 12.4C5.09998 11.5716 4.4284 10.9 3.59998 10.9ZM1.09998 12.4C1.09998 11.0193 2.21926 9.90002 3.59998 9.90002C4.98069 9.90002 6.09998 11.0193 6.09998 12.4C6.09998 13.7807 4.98069 14.9 3.59998 14.9C2.21926 14.9 1.09998 13.7807 1.09998 12.4Z" fill="color(display-p3 .6 .6 .6)"></path></symbol><symbol xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16" id="svgicon-article-listen-gray-disabled"><path fill-rule="evenodd" clip-rule="evenodd" d="M8 2.90002C6.067 2.90002 4.5 4.46703 4.5 6.40003V12.8C4.5 13.0762 4.27614 13.3 4 13.3C3.72386 13.3 3.5 13.0762 3.5 12.8V6.40003C3.5 3.91475 5.51472 1.90002 8 1.90002C10.4853 1.90002 12.5 3.91474 12.5 6.40002V12.8C12.5 13.0762 12.2761 13.3 12 13.3C11.7239 13.3 11.5 13.0762 11.5 12.8V6.40002C11.5 4.46703 9.933 2.90002 8 2.90002Z" fill="color(display-p3 .6 .6 .6)"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M11.5 7.59998C11.5 7.32383 11.7239 7.09998 12 7.09998C13.6016 7.09998 14.9 8.39835 14.9 9.99998V10.4C14.9 12.0016 13.6016 13.3 12 13.3C11.7239 13.3 11.5 13.0761 11.5 12.8C11.5 12.5238 11.7239 12.3 12 12.3C13.0493 12.3 13.9 11.4493 13.9 10.4V9.99998C13.9 8.95063 13.0493 8.09998 12 8.09998C11.7239 8.09998 11.5 7.87612 11.5 7.59998Z" fill="color(display-p3 .6 .6 .6)"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M4.5 7.59998C4.5 7.32383 4.27614 7.09998 4 7.09998C2.39837 7.09998 1.1 8.39835 1.1 9.99998V10.4C1.1 12.0016 2.39837 13.3 4 13.3C4.27614 13.3 4.5 13.0761 4.5 12.8C4.5 12.5238 4.27614 12.3 4 12.3C2.95066 12.3 2.1 11.4493 2.1 10.4V9.99998C2.1 8.95063 2.95066 8.09998 4 8.09998C4.27614 8.09998 4.5 7.87612 4.5 7.59998Z" fill="color(display-p3 .6 .6 .6)"></path></symbol><symbol xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" id="svgicon-kbar-hot_tag"><defs><rect id="svgicon-kbar-hot_tag_vdpcnm5sb__isy0bahe8a" x="0" y="0" width="24" height="24" rx="6"></rect></defs><g fill="none" fill-rule="evenodd"><g><use fill="#FFF" xlink:href="#svgicon-kbar-hot_tag_vdpcnm5sb__isy0bahe8a"></use><use fill="#F25550" xlink:href="#svgicon-kbar-hot_tag_vdpcnm5sb__isy0bahe8a"></use></g><path d="M12.0020111,19 C15.0203373,19 17.5,16.71597 17.5,13.784335 C17.5,13.06463 17.4616968,12.293125 17.0439174,11.09406 C16.626138,9.89503 16.541981,9.74026 16.10023,8.999765 C15.9114999,10.51089 14.9016891,11.14068 14.6451495,11.32891 C14.6451495,11.133085 14.3650795,9.286418 13.1080746,7.671865 C11.8180534,6.01490456 10.9622908,5.565572 10.237243,5 C10.237243,6.0744195 9.81142738,7.50054398 9.35180369,8.30863033 C8.55509947,9.70935407 6.61529718,11.1628274 6.50394879,13.896335 C6.38469042,16.8240261 8.98368483,19 12.0020111,19 Z" stroke="#FFF" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"></path><path d="M11,15.25 C11.4418278,15.8022847 12.2477153,15.8918278 12.8,15.45 C12.8738469,15.3909225 12.9409225,15.3238469 13,15.25 L13,15.25 L13,15.25" stroke="#FFF" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"></path></g></symbol><symbol xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 16 16" id="svgicon-kbar-quit_down"><title>下箭头</title><g id="svgicon-kbar-quit_down_主页编辑" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="svgicon-kbar-quit_down_1201-K吧导航栏" transform="translate(-589.000000, -140.000000)" fill="#FFFFFF" fill-rule="nonzero"><g id="svgicon-kbar-quit_down_编组-30" transform="translate(410.000000, 74.000000)"><g id="svgicon-kbar-quit_down_编组-31" transform="translate(120.000000, 58.000000)"><g id="svgicon-kbar-quit_down_下拉备份-5" transform="translate(59.000000, 8.000000)"><path d="M2.64644661,5.14644661 C2.82001296,4.97288026 3.08943736,4.95359511 3.2843055,5.08859116 L3.35355339,5.14644661 L8,9.793 L12.6464466,5.14644661 C12.820013,4.97288026 13.0894374,4.95359511 13.2843055,5.08859116 L13.3535534,5.14644661 C13.5271197,5.32001296 13.5464049,5.58943736 13.4114088,5.7843055 L13.3535534,5.85355339 L8.35355339,10.8535534 C8.17998704,11.0271197 7.91056264,11.0464049 7.7156945,10.9114088 L7.64644661,10.8535534 L2.64644661,5.85355339 C2.45118446,5.65829124 2.45118446,5.34170876 2.64644661,5.14644661 Z" id="svgicon-kbar-quit_down_路径-5备份"></path></g></g></g></g></g></symbol><symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" id="svgicon-kbar-qrcode"><g stroke="#FFF" stroke-width="1.66666667" fill="none" fill-rule="evenodd"><path stroke-linejoin="round" d="M5.83333333 -8.8817842e-16L0 -8.8817842e-16 0 5.83333333 5.83333333 5.83333333z" transform="translate(2.5 2.5)"></path><path stroke-linejoin="round" d="M5.83333333 9.16666667L0 9.16666667 0 15 5.83333333 15z" transform="translate(2.5 2.5)"></path><path stroke-linejoin="round" d="M15 -8.8817842e-16L9.16666667 -8.8817842e-16 9.16666667 5.83333333 15 5.83333333z" transform="translate(2.5 2.5)"></path><path stroke-linecap="round" d="M9.58333333 9.16666667L9.58333333 15" transform="translate(2.5 2.5)"></path><path stroke-linecap="round" d="M14.5833333 9.16666667L14.5833333 15" transform="translate(2.5 2.5)"></path></g></symbol><symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" id="svgicon-kbar-action_add"><g stroke="#FFF" stroke-width=".9" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"><path d="M0 4.125L8.25 4.125" transform="translate(1.875 1.875)"></path><path d="M4.125 0L4.125 8.25" transform="translate(1.875 1.875)"></path></g></symbol><symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" id="svgicon-q-entry_change"><g stroke="#999" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"><path d="M9.73333333 0.53333333L9.73333333 4.8" transform="matrix(1 0 0 -1 3.04 12.8)"></path><path d="M0.13333333 4.8L0.13333333 9.06666667" transform="matrix(1 0 0 -1 3.04 12.8)"></path><path d="M9.73333333,4.8 C9.73333333,2.14904 7.58429333,0 4.93333333,0 C3.5772,0 2.35242667,0.562389333 1.47949333,1.46666667 M0.133333333,4.8 C0.133333333,7.45096 2.28237333,9.6 4.93333333,9.6 C6.22816,9.6 7.40325333,9.08730667 8.26666667,8.25384" transform="matrix(1 0 0 -1 3.04 12.8)"></path></g></symbol><symbol xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 20 20" id="svgicon-q-entry_article"><defs><linearGradient x1="100%" y1="100%" x2="0%" y2="0%" id="svgicon-q-entry_article_bm7xmwdoi__3sncozpxcb"><stop stop-color="#00FA79" offset="0%"></stop><stop stop-color="#02C761" offset="100%"></stop></linearGradient><linearGradient x1="50%" y1="100%" x2="50%" y2="0%" id="svgicon-q-entry_article_bm7xmwdoi__527pp9x5he"><stop stop-color="#FFF" offset="0%"></stop><stop stop-color="#FFF" stop-opacity=".89705631" offset="100%"></stop></linearGradient><rect id="svgicon-q-entry_article_bm7xmwdoi__jbf7uwnlya" x="0" y="0" width="20" height="20" rx="3.80952381"></rect></defs><g fill="none" fill-rule="evenodd"><g><mask id="svgicon-q-entry_article_bm7xmwdoi__i8cqt3xpcd" fill="#fff"><use xlink:href="#svgicon-q-entry_article_bm7xmwdoi__jbf7uwnlya"></use></mask><use fill="url(#svgicon-q-entry_article_bm7xmwdoi__3sncozpxcb)" fill-rule="nonzero" xlink:href="#svgicon-q-entry_article_bm7xmwdoi__jbf7uwnlya"></use><path fill="#FFF" opacity=".2" filter="url(#svgicon-q-entry_article_bm7xmwdoi__elug18utic)" mask="url(#svgicon-q-entry_article_bm7xmwdoi__i8cqt3xpcd)" d="M10 17.619047629999997A5.95238095 3.57142857 0 1 0 10 24.76190477A5.95238095 3.57142857 0 1 0 10 17.619047629999997Z"></path></g><path d="M3.33333333,0 C5.1742825,-1.77635684e-15 6.66666667,1.49238417 6.66666667,3.33333333 L6.66666667,10.8333333 L0.833333333,10.8333333 C0.373096042,10.8333333 -6.11474325e-16,10.4602373 0,10 L0,0 L3.33333333,0 Z M4.16666667,5.41666667 L2.08333333,5.41666667 L2.08333333,6.25 L4.16666667,6.25 L4.16666667,5.41666667 Z M4.16666667,2.91666667 L2.08333333,2.91666667 L2.08333333,3.75 L4.16666667,3.75 L4.16666667,2.91666667 Z" fill="url(#svgicon-q-entry_article_bm7xmwdoi__527pp9x5he)" transform="translate(4.166667 4.583333)"></path><path d="M11.6666667,0.833333333 L11.6666667,10.8333333 L11.6666667,10.8333333 L8.33333333,10.8333333 C6.49238417,10.8333333 5,9.34094917 5,7.5 L5,0 L5,0 L10.8333333,0 C11.2935706,-8.45442189e-17 11.6666667,0.373096042 11.6666667,0.833333333 Z" fill-opacity=".6" fill="#FFF" transform="matrix(1 0 0 -1 4.166667 15.416667)"></path></g></symbol><symbol xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 16 16" id="svgicon-q-entry_lewen"><defs><linearGradient x1="0%" y1="0%" x2="100%" y2="100%" id="svgicon-q-entry_lewen_fip5131uc__ch6tnklsvb"><stop stop-color="#FF9E3F" offset="0%"></stop><stop stop-color="#FFE669" offset="100%"></stop></linearGradient><linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="svgicon-q-entry_lewen_fip5131uc__dgwjuoktue"><stop stop-color="#FFF" offset="0%"></stop><stop stop-color="#FFF" stop-opacity=".89705631" offset="100%"></stop></linearGradient><rect id="svgicon-q-entry_lewen_fip5131uc__gvy3ofst0a" x="0" y="0" width="16" height="16" rx="3.04761905"></rect></defs><g fill="none" fill-rule="evenodd"><g><mask id="svgicon-q-entry_lewen_fip5131uc__9mp0tqct8d" fill="#fff"><use xlink:href="#svgicon-q-entry_lewen_fip5131uc__gvy3ofst0a"></use></mask><use fill="url(#svgicon-q-entry_lewen_fip5131uc__ch6tnklsvb)" fill-rule="nonzero" xlink:href="#svgicon-q-entry_lewen_fip5131uc__gvy3ofst0a"></use><path fill="#FFF" opacity=".2" filter="url(#svgicon-q-entry_lewen_fip5131uc__daynt8j0hc)" mask="url(#svgicon-q-entry_lewen_fip5131uc__9mp0tqct8d)" d="M8 14.09523814A4.76190476 2.85714286 0 1 0 8 19.80952386A4.76190476 2.85714286 0 1 0 8 14.09523814Z"></path></g><path d="M7.33333333,4 C8.62199775,4 9.66666667,5.04466892 9.66666667,6.33333333 C9.66666667,7.04209876 9.35065432,7.67705555 8.85184166,8.10499166 L9.33333333,8.66666667 L7.33333333,8.66666667 C6.04466892,8.66666667 5,7.62199775 5,6.33333333 C5,5.04466892 6.04466892,4 7.33333333,4 Z" fill="#FFF" fill-rule="nonzero" opacity=".60000002" transform="translate(3.166667 3.666667)"></path><path d="M1,8.66666667 L1.69094054,7.76806707 C0.662568,6.97574918 0,5.73191678 0,4.33333333 C0,1.94009942 1.94009942,0 4.33333333,0 C6.72656725,0 8.66666667,1.94009942 8.66666667,4.33333333 C8.66666667,6.72656725 6.72656725,8.66666667 4.33333333,8.66666667 L1,8.66666667 Z" fill="url(#svgicon-q-entry_lewen_fip5131uc__dgwjuoktue)" transform="translate(3.166667 3.666667)"></path><path d="M2.83333333,2.66666667 L5.5,2.66666667 L5.5,4.33333333 L3.83333333,4.33333333 L3.83333333,5 M3.83333333,5.66666667 L3.83333333,6.33333333" stroke="#FFAC48" stroke-width=".66666667" transform="translate(3.166667 3.666667)"></path></g></symbol><symbol xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 16 16" id="svgicon-q-entry_knowledge"><defs><linearGradient x1="100%" y1="100%" x2="0%" y2="0%" id="svgicon-q-entry_knowledge_hz0hbfb19__e0zo94jajb"><stop stop-color="#56E0FC" offset="0%"></stop><stop stop-color="#0082FC" offset="100%"></stop></linearGradient><linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="svgicon-q-entry_knowledge_hz0hbfb19__a7n5pdjble"><stop stop-color="#FFF" offset="0%"></stop><stop stop-color="#FFF" stop-opacity=".89705631" offset="100%"></stop></linearGradient><rect id="svgicon-q-entry_knowledge_hz0hbfb19__e3ejwa83ea" x="0" y="0" width="16" height="16" rx="3.04761905"></rect></defs><g fill="none" fill-rule="evenodd"><g><mask id="svgicon-q-entry_knowledge_hz0hbfb19__qk54y8a68d" fill="#fff"><use xlink:href="#svgicon-q-entry_knowledge_hz0hbfb19__e3ejwa83ea"></use></mask><use fill="url(#svgicon-q-entry_knowledge_hz0hbfb19__e0zo94jajb)" fill-rule="nonzero" xlink:href="#svgicon-q-entry_knowledge_hz0hbfb19__e3ejwa83ea"></use><path fill="#FFF" opacity=".2" filter="url(#svgicon-q-entry_knowledge_hz0hbfb19__h2ggva1lbc)" mask="url(#svgicon-q-entry_knowledge_hz0hbfb19__qk54y8a68d)" d="M8 14.09523814A4.76190476 2.85714286 0 1 0 8 19.80952386A4.76190476 2.85714286 0 1 0 8 14.09523814Z"></path></g><path d="M1,0.833333333 L8,0.833333333 L8,0.833333333 L8,9.5 L0.666666667,9.5 C0.298476833,9.5 2.67134855e-16,9.20152317 0,8.83333333 L0,8.83333333 L0,8.83333333 L0,1.83333333 C-6.76353751e-17,1.28104858 0.44771525,0.833333333 1,0.833333333 Z" fill-opacity=".7" fill="#FFF" transform="translate(4 3.166667)"></path><path d="M1,0 L2.66666667,0 L2.66666667,0 L2.66666667,8 L0.833333333,8 C0.373096042,8 -5.63628126e-17,8.37309604 0,8.83333333 L0,8.83333333 L0,8.83333333 L0,1 C-6.76353751e-17,0.44771525 0.44771525,1.01453063e-16 1,0 Z" fill="url(#svgicon-q-entry_knowledge_hz0hbfb19__a7n5pdjble)" transform="translate(4 3.166667)"></path><path stroke="#179BFC" stroke-width=".66666667" stroke-linecap="square" stroke-linejoin="round" d="M4.83333333 5.83333333L6.16666667 5.83333333" transform="translate(4 3.166667)"></path><path stroke="#179BFC" stroke-width=".66666667" stroke-linecap="square" stroke-linejoin="round" d="M4.83333333 7.5L6.16666667 7.5" transform="translate(4 3.166667)"></path></g></symbol><symbol xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 16 16" id="svgicon-q-entry_user"><defs><linearGradient x1="0%" y1="0%" x2="100%" y2="100%" id="svgicon-q-entry_user_dvj3pf198__lozif2v1cb"><stop stop-color="#FF2F2F" offset="0%"></stop><stop stop-color="#FFA380" offset="100%"></stop></linearGradient><linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="svgicon-q-entry_user_dvj3pf198__dlmmuwggje"><stop stop-color="#FFF" offset="0%"></stop><stop stop-color="#FFF" stop-opacity=".89705631" offset="100%"></stop></linearGradient><rect id="svgicon-q-entry_user_dvj3pf198__uy1lq79yja" x="0" y="0" width="16" height="16" rx="3.04761905"></rect></defs><g fill="none" fill-rule="evenodd"><g><mask id="svgicon-q-entry_user_dvj3pf198__iq13we1lod" fill="#fff"><use xlink:href="#svgicon-q-entry_user_dvj3pf198__uy1lq79yja"></use></mask><use fill="url(#svgicon-q-entry_user_dvj3pf198__lozif2v1cb)" fill-rule="nonzero" xlink:href="#svgicon-q-entry_user_dvj3pf198__uy1lq79yja"></use><path fill="#FFF" opacity=".2" filter="url(#svgicon-q-entry_user_dvj3pf198__4marrinx7c)" mask="url(#svgicon-q-entry_user_dvj3pf198__iq13we1lod)" d="M8 14.09523814A4.76190476 2.85714286 0 1 0 8 19.80952386A4.76190476 2.85714286 0 1 0 8 14.09523814Z"></path></g><path d="M4,4.33333333 L9,4.33333333 L9,5 L9,6.5 C9,7.88071187 7.88071187,9 6.5,9 C5.11928813,9 4,7.88071187 4,6.5 L4,5 L4,5 L4,4.33333333 Z M6.83333333,0 C7.84585537,-1.85997282e-16 8.66666667,0.820811292 8.66666667,1.83333333 C8.66666667,2.84585537 7.84585537,3.66666667 6.83333333,3.66666667 C5.82081129,3.66666667 5,2.84585537 5,1.83333333 C5,0.820811292 5.82081129,1.85997282e-16 6.83333333,0 Z" fill-opacity=".6" fill="#FFF" transform="translate(3.5 3.5)"></path><path d="M0,4.33333333 L5,4.33333333 L5,5 L5,6.5 C5,7.88071187 3.88071187,9 2.5,9 C1.11928813,9 -1.16317919e-15,7.88071187 0,6.5 L0,5 L0,5 L0,4.33333333 Z M2.16666667,0 C3.17918871,-1.85997282e-16 4,0.820811292 4,1.83333333 C4,2.84585537 3.17918871,3.66666667 2.16666667,3.66666667 C1.15414463,3.66666667 0.333333333,2.84585537 0.333333333,1.83333333 C0.333333333,0.820811292 1.15414463,1.85997282e-16 2.16666667,0 Z" fill="url(#svgicon-q-entry_user_dvj3pf198__dlmmuwggje)" transform="translate(3.5 3.5)"></path></g></symbol><symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" id="svgicon-common-agree"><path d="M4.39999998,17.5 C3.40062758,17.5 2.58146567,16.7284272 2.5057164,15.7484839 L2.5,15.6 L2.5,10.4 C2.5,9.40062758 3.27157276,8.58146567 4.2515161,8.5057164 L4.39999998,8.5 L6.639,8.5 L8.52565835,2.84188612 C8.58546373,2.66246997 8.73844942,2.53751149 8.91551927,2.50706293 L9.00574132,2.4998999 L9.09805807,2.50970966 L9.99029034,2.68815612 C11.1032051,2.91073907 11.9191481,3.8519841 11.9943334,4.97055923 L12,5.13960781 L12,7.5 L15.539713,7.5015346 L15.6138663,7.50613318 L15.7613196,7.52449094 C16.6928768,7.67975049 17.3373027,8.52450063 17.2592946,9.44931795 L17.2409105,9.59591826 L16.1324638,16.2465985 C16.019451,16.9246753 15.4623812,17.4329805 14.7890024,17.4938699 L14.6528729,17.5 L4.39999998,17.5 Z M6.5,9.49986504 L4.39999998,9.5 C3.94117881,9.5 3.56254822,9.84333666 3.50701228,10.2871059 L3.5,10.4 L3.5,15.6 C3.5,16.0588212 3.84333666,16.4374518 4.28710589,16.4929877 L4.39999998,16.5 L6.5,16.499865 L6.5,9.49986504 Z M9.335,3.576 L7.5,9.07986504 L7.5,16.499865 L14.6528729,16.5 C14.86674,16.5 15.053179,16.3647091 15.1233661,16.1693722 L15.1460699,16.0821995 L16.2545166,9.43151927 C16.3271526,8.99570298 16.0327369,8.58352091 15.5969206,8.51088486 L15.5313858,8.50272586 L15.5313858,8.50272586 L15.4654014,8.5 L11.5,8.5 C11.2545401,8.5 11.0503916,8.32312484 11.0080557,8.08987563 L11,8 L11,5.13960781 C11,4.47225438 10.5603594,3.89148879 9.93169084,3.70300944 L9.7941742,3.66873679 L9.335,3.576 Z" fill-rule="nonzero"></path></symbol><symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" id="svgicon-common-more"><path d="M3.75,8.75 C4.44035594,8.75 5,9.30964406 5,10 C5,10.6903559 4.44035594,11.25 3.75,11.25 C3.05964406,11.25 2.5,10.6903559 2.5,10 C2.5,9.30964406 3.05964406,8.75 3.75,8.75 Z M10,8.75 C10.6903559,8.75 11.25,9.30964406 11.25,10 C11.25,10.6903559 10.6903559,11.25 10,11.25 C9.30964406,11.25 8.75,10.6903559 8.75,10 C8.75,9.30964406 9.30964406,8.75 10,8.75 Z M16.25,8.75 C16.9403559,8.75 17.5,9.30964406 17.5,10 C17.5,10.6903559 16.9403559,11.25 16.25,11.25 C15.5596441,11.25 15,10.6903559 15,10 C15,9.30964406 15.5596441,8.75 16.25,8.75 Z" fill-rule="evenodd"></path></symbol><symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" id="svgicon-common-disagree"><path d="M4.39999998,17.5 C3.40062758,17.5 2.58146567,16.7284272 2.5057164,15.7484839 L2.5,15.6 L2.5,10.4 C2.5,9.40062758 3.27157276,8.58146567 4.2515161,8.5057164 L4.39999998,8.5 L6.639,8.5 L8.52565835,2.84188612 C8.58546373,2.66246997 8.73844942,2.53751149 8.91551927,2.50706293 L9.00574132,2.4998999 L9.09805807,2.50970966 L9.99029034,2.68815612 C11.1032051,2.91073907 11.9191481,3.8519841 11.9943334,4.97055923 L12,5.13960781 L12,7.5 L15.539713,7.5015346 L15.6138663,7.50613318 L15.7613196,7.52449094 C16.6928768,7.67975049 17.3373027,8.52450063 17.2592946,9.44931795 L17.2409105,9.59591826 L16.1324638,16.2465985 C16.019451,16.9246753 15.4623812,17.4329805 14.7890024,17.4938699 L14.6528729,17.5 L4.39999998,17.5 Z M6.5,9.49986504 L4.39999998,9.5 C3.94117881,9.5 3.56254822,9.84333666 3.50701228,10.2871059 L3.5,10.4 L3.5,15.6 C3.5,16.0588212 3.84333666,16.4374518 4.28710589,16.4929877 L4.39999998,16.5 L6.5,16.499865 L6.5,9.49986504 Z M9.335,3.576 L7.5,9.07986504 L7.5,16.499865 L14.6528729,16.5 C14.86674,16.5 15.053179,16.3647091 15.1233661,16.1693722 L15.1460699,16.0821995 L16.2545166,9.43151927 C16.3271526,8.99570298 16.0327369,8.58352091 15.5969206,8.51088486 L15.5313858,8.50272586 L15.5313858,8.50272586 L15.4654014,8.5 L11.5,8.5 C11.2545401,8.5 11.0503916,8.32312484 11.0080557,8.08987563 L11,8 L11,5.13960781 C11,4.47225438 10.5603594,3.89148879 9.93169084,3.70300944 L9.7941742,3.66873679 L9.335,3.576 Z" transform="matrix(1 0 0 -1 0 20)" fill-rule="nonzero"></path></symbol><symbol xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16" id="svgicon-article-listen-gray"><path fill-rule="evenodd" clip-rule="evenodd" d="M8 2.90002C6.067 2.90002 4.5 4.46703 4.5 6.40003V12.8C4.5 13.0762 4.27614 13.3 4 13.3C3.72386 13.3 3.5 13.0762 3.5 12.8V6.40003C3.5 3.91475 5.51472 1.90002 8 1.90002C10.4853 1.90002 12.5 3.91474 12.5 6.40002V12.8C12.5 13.0762 12.2761 13.3 12 13.3C11.7239 13.3 11.5 13.0762 11.5 12.8V6.40002C11.5 4.46703 9.933 2.90002 8 2.90002Z" fill="color(display-p3 .102 .102 .102)"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M11.5 7.59998C11.5 7.32383 11.7239 7.09998 12 7.09998C13.6016 7.09998 14.9 8.39835 14.9 9.99998V10.4C14.9 12.0016 13.6016 13.3 12 13.3C11.7239 13.3 11.5 13.0761 11.5 12.8C11.5 12.5238 11.7239 12.3 12 12.3C13.0493 12.3 13.9 11.4493 13.9 10.4V9.99998C13.9 8.95063 13.0493 8.09998 12 8.09998C11.7239 8.09998 11.5 7.87612 11.5 7.59998Z" fill="color(display-p3 .102 .102 .102)"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M4.5 7.59998C4.5 7.32383 4.27614 7.09998 4 7.09998C2.39837 7.09998 1.1 8.39835 1.1 9.99998V10.4C1.1 12.0016 2.39837 13.3 4 13.3C4.27614 13.3 4.5 13.0761 4.5 12.8C4.5 12.5238 4.27614 12.3 4 12.3C2.95066 12.3 2.1 11.4493 2.1 10.4V9.99998C2.1 8.95063 2.95066 8.09998 4 8.09998C4.27614 8.09998 4.5 7.87612 4.5 7.59998Z" fill="color(display-p3 .102 .102 .102)"></path></symbol><symbol xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16" id="svgicon-article-article-abstract"><path d="M3.20001 3.2C3.20001 2.53726 3.73727 2 4.40001 2H11.6C12.2628 2 12.8 2.53726 12.8 3.2V8V12.8C12.8 13.4627 12.2628 14 11.6 14H4.40001C3.73727 14 3.20001 13.4627 3.20001 12.8V3.2Z" stroke="color(display-p3 .102 .102 .102)"></path><path d="M6.40002 11.6H9.60002" stroke="color(display-p3 .102 .102 .102)" stroke-linecap="round"></path><path d="M6.40002 9.19995H9.60002" stroke="color(display-p3 .102 .102 .102)" stroke-linecap="round"></path></symbol><symbol xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16" id="svgicon-article-mindmap"><path fill-rule="evenodd" clip-rule="evenodd" d="M5.09998 3.59998C5.09998 3.32383 5.32383 3.09998 5.59998 3.09998H10.8C11.9598 3.09998 12.9 4.04018 12.9 5.19998V5.99998C12.9 6.27612 12.6761 6.49998 12.4 6.49998C12.1238 6.49998 11.9 6.27612 11.9 5.99998V5.19998C11.9 4.59246 11.4075 4.09998 10.8 4.09998H5.59998C5.32383 4.09998 5.09998 3.87612 5.09998 3.59998Z" fill="color(display-p3 .102 .102 .102)"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M5.09998 12.4C5.09998 12.6762 5.32383 12.9 5.59998 12.9H10.8C11.9598 12.9 12.9 11.9598 12.9 10.8V10C12.9 9.72388 12.6761 9.50002 12.4 9.50002C12.1238 9.50002 11.9 9.72388 11.9 10V10.8C11.9 11.4075 11.4075 11.9 10.8 11.9H5.59998C5.32383 11.9 5.09998 12.1239 5.09998 12.4Z" fill="color(display-p3 .102 .102 .102)"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M3.59998 2.09998C2.77155 2.09998 2.09998 2.77155 2.09998 3.59998C2.09998 4.4284 2.77155 5.09998 3.59998 5.09998C4.4284 5.09998 5.09998 4.4284 5.09998 3.59998C5.09998 2.77155 4.4284 2.09998 3.59998 2.09998ZM1.09998 3.59998C1.09998 2.21926 2.21926 1.09998 3.59998 1.09998C4.98069 1.09998 6.09998 2.21926 6.09998 3.59998C6.09998 4.98069 4.98069 6.09998 3.59998 6.09998C2.21926 6.09998 1.09998 4.98069 1.09998 3.59998Z" fill="color(display-p3 .102 .102 .102)"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M12.4 6.5C11.5716 6.5 10.9 7.17157 10.9 8C10.9 8.82843 11.5716 9.5 12.4 9.5C13.2285 9.5 13.9 8.82843 13.9 8C13.9 7.17157 13.2285 6.5 12.4 6.5ZM9.90002 8C9.90002 6.61929 11.0193 5.5 12.4 5.5C13.7807 5.5 14.9 6.61929 14.9 8C14.9 9.38071 13.7807 10.5 12.4 10.5C11.0193 10.5 9.90002 9.38071 9.90002 8Z" fill="color(display-p3 .102 .102 .102)"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M3.59998 10.9C2.77155 10.9 2.09998 11.5716 2.09998 12.4C2.09998 13.2285 2.77155 13.9 3.59998 13.9C4.4284 13.9 5.09998 13.2285 5.09998 12.4C5.09998 11.5716 4.4284 10.9 3.59998 10.9ZM1.09998 12.4C1.09998 11.0193 2.21926 9.90002 3.59998 9.90002C4.98069 9.90002 6.09998 11.0193 6.09998 12.4C6.09998 13.7807 4.98069 14.9 3.59998 14.9C2.21926 14.9 1.09998 13.7807 1.09998 12.4Z" fill="color(display-p3 .102 .102 .102)"></path></symbol></svg>

严禁未经授权通过爬虫等自动化工具获取或留存系统数据，一经发现将按公司信息安全规定追责处理。如有工作需求，请使用 KM 官方 [MCP](https://knot.woa.com/mcp/detail/3252) / [SKILL](https://knot.woa.com/skills/detail/3044) 。

文章摘要

思维导图

文章朗读

丨 导语 2 人团队，3 个业务代码仓库，20 万行遗留代码。重构计划写了三年，一行没动。直到 AI 进场我们才发现：卡了三年的从来不是代码，是代码背后那部分从未被写下来的工程基建。本文一半是落地实践，一半是落地之后的深度思考——很多看起来关于 AI 的事情，是真的做出来之后才想明白的。

## 前言：一个永远开不了工的重构计划

一个两人维护的 20 万行代码的咕噜棒子系统。一条订单从下单到交付要经过十几个环节、能走出几十种分支路径、对接 10 多家外部厂商、业务周期动辄跨年。改一行代码牵一发动全身，理解逻辑全靠翻源码，知识全装在老人脑子里。怎么治？

在 AI Coding 热潮来临之前，我们的计划是 **重构** ——用新的设计重写核心模块，统一技术栈，补齐单测，建立规范。这是所有技术团队面对烂摊子时的标准答案：代码不行，就重写代码。

但这个计划一直停在"计划"阶段。原因所有人都懂：成本太大，两个人的团队根本抽不出整块时间；收益又说不清楚——重构完除了代码更整洁，业务方看到的功能一个都没多。它永远排在需求后面，永远"等这波忙完就开始"，永远不开始。

但问题不会就此消失——  
重构走不通，历史包袱到底怎么还？

后来我们开始用 AI 写代码，很快发现一件事： **AI 犯的错和新人犯的错，一模一样。** 漏掉了某个边界条件、不清楚对上下游的影响、少考虑了一条异常分支。原因也一样——不是能力不够，是没人告诉它上下文。

恰好，Harness Engineering 的核心就是解决这件事：给 AI 补齐它工作所需的一切,包括上下文、规范、自动化拦截、知识沉淀。

重构说的是"代码不行，重写代码"；Harness 说的是"代码可以不动，把代码背后缺失的工程基建补齐就好"。前者成本巨大、永远开不了工；后者成本可控，而且每一步都有即时收益。

那这件事，具体如何开始？

---

## Harness Engineering是什么？起初我们也搞不懂

按惯例，一篇讲 Harness 实践的文章应该先回答"Harness 是什么"。我们最初也是这么想的——开工前先把概念搞清楚，找一份官方定义、一套最佳实践、一张架构图，照着抄就行。

于是我们花了不少时间去搜：Google、公司内网、各种技术博客、Anthropic 的官方文档……答案五花八门。有人说它是给 AI 套上的"约束框架"，有人说它是"上下文工程"的别名，有人把它和 Agent 工程混在一起讲，还有人干脆说"Harness 就是你给 AI 配的那一堆 prompt 和工具"。

这让我们很不适应。在我们传统的认知里，一个新的工程范式(比如微服务、DDD、Serverless)，通常都会有清晰的定义、标准的分层、成熟的实践指南。你照着学、照着做，至少不会跑偏。但 Harness 不是。它没有标准答案，也没有"权威实现"。每个团队讲的 Harness 都长得不太一样。

更糟的是，因为想"先搞懂再动手"，我们硬是耽误了两周——一直在读资料、画架构图、争论"我们的 Harness 应该长什么样"，但一行代码、一条 Rule 都没落地。

后来我们想通了一件事： **Harness 之所以没有标准答案，是因为它本来就该长在每个团队自己的项目土壤里。** 你的代码组织、技术栈、痛点、团队规模、AI 用法——这些决定了你的 Harness 长什么样。别人的架构图直接抄过来，多半水土不服。

如果你是带着 Harness 是什么的疑问读到了这里，那就保持疑问继续往下看，你会有自己的答案。

---

## L1：在能写之前，它必须先能看见

我们以为 AI 很聪明。

毕竟它能读懂任何编程语言、能一次性生成几百行代码、能分析复杂的业务逻辑。但当我们把它放进一个跑了五年的供应链仓库，给它一个最日常的活—— **让一笔订单推送给下游系统时，多带一个"批次价状态"字段** 。结果它翻车了。

它扫了一圈代码，自信地说：这个值来自上游请求，需要在入参里加个字段，再补一段映射代码。听起来合情合理。

但我们一眼就拦下了： **错。** 这个值根本不是上游传的——它在主流程的中段，由内部价格服务回填进了实体，进库之前就已经赋好了。AI 漏看了主流程后半段那次调用，就开始拍脑袋猜来源、动手改协议。

**原因很简单：没人告诉它。**

### 工程师身上的反射，AI 没有

任何一个跑了几年的项目，都会在工程师身上长出一些 **反射** ——

看见某个字段被赋值，下意识知道这个值不是上游传的、是内部某个服务回填的；看见一张业务表，立刻想起业务编号存在哪个字段、要换成主键得走哪个查询；看见一批同步过来的预测字段，知道整批数据都来自外部 ERP 同一个接口、按 500 条一批刷过来的。

这些反射不是教出来的，是一次次踩坑、一次次半夜修线上、一次次 code review 拍肩膀的"别这么写，相信我"——慢慢沉积出来的。它们人脑子里，活在团队默契里，活在"大家都懂所以不用说"的潜台词里。

但 AI 没有这种反射。它一开会话就问出几个让我们卡壳的问题：

- **这个字段是入参传的，还是流程里某一步回填的？**
- **这个 ID 是调用方传进来的，还是系统自己生成的？写之前要做哪些校验？**
- **业务编号在表里叫什么字段？要换成主键得走哪个查询？**
- **这一批同步过来的字段，每个对应外部接口返回里的哪个 key？**

工程师彼此一个眼神就懂的事——AI 是个不参与默契的读者。它的每一句"请明确定义"，都把我们脑子里说不清的部分， **逼成了文字** 。

我们以为在给 AI 写文档。

其实是 AI 在给我们写文档——它问的每一个问题，都对应着一条我们工作了好几年但从未写下来过的判断。"为什么这个价格相关字段不能从入参拿"、"为什么写一条变更明细之前必须先去主表验证存在性"、"为什么这张表的某个枚举字段只能取那几个值":这些"为什么"，是项目跑了 N 年的结晶，也是离职的人带走、新来的人重学、老人忘了重新踩的那部分知识。

写下来不只是给 AI 看，也是给我们自己看。 **AI 不是这件事的目的，是这件事的扳机。**

### 把 AI "逼"出来的文字，分三类

这些被 AI "逼"出来的文字，我们把它分成三类。每一类各有各的位置、各有各的用法：

```
🗺️  contexts/<仓>/CLAUDE.md  → 导航地图:每个业务仓一份"项目自画像"
📋  rules/                  → 操作守则:该做什么、不该做什么
📖  knowledge/              → 领域知识:项目里某个字段、某条流程、某条规则到底是什么
```

**导航地图**:技术栈、模块结构、5 个数据源各属于哪个域、Feign 调用方向、跨仓改 A 要同步 B 的依赖矩阵。这一类我们写进各仓的 `CLAUDE.md` ，每次会话开局自动加载。

实际打开一个 CLAUDE.md，最顶上是一张"快速导航表"——AI 第一眼就能定位到任何东西在哪里：

我想...

怎么找

修改前预防红线

先扫 `.claude/rules/must-not-do.md`

查项目相关知识(术语/字段/流程/约束等)

在 `.claude/knowledge/` 下探索

查行为规则规范(编码/必做/不可做)

在 `.claude/rules/` 下探索

触发能力工作流

在 `.claude/skills/` 下找对应 skill

找不到答案

**直接问用户,严禁瞎猜**

紧跟其后是 **项目概要** 、 **技术栈** 、 **代码架构** 、 **跨服务依赖矩阵**,合起来是一份"项目自画像"。

**操作守则**:既包括"该做什么"（任务开工前必须先检索知识库再下结论、commit 前必须做经验扫描），也包括"不该做什么"（数据库更新必须用新对象避免并发覆盖，这是踩了多次的坑；跨仓变更必须在 commit message 上标 `[cross-repo-impact]` ）。这些写进 `rules/` 里，每次会话自动被加载。

**领域知识**:比如某个字段的含义、两个相似字段在不同业务场景下分别取哪个、采购模式如何在 ODM 和 OEM 之间切换、整个供应链的数据流向、6 个业务 stage 的主流程。这一类是项目跑了几年沉淀下来的具体细节，写进 `knowledge/` 下，按场景按需查阅，不每次都加载。

三种东西不能混：导航地图说明你 **在哪、是什么样** ；操作守则说明你 **该怎么走、不能怎么走** ；领域知识回答 **你看到的某个东西到底是什么、为什么** 。混在一起 AI 就懵了——有些每次都要读，有些只在特定时刻读，有些则是"碰不得"。

### 领域知识还有更细的分层

领域知识这一层，我们还做了更细的分层——但分的不是"内容类型"，是 **使用模式** ：

```
knowledge/
├── reference/                    📖 查了就走
│   ├── glossary.md              ←  术语词典
│   └── field-maps/              ←  字段映射卡片
│       ├── pr-apply-resource.md
│       ├── pr-apply-cubes.md
│       ├── sales-order-lines-all.md
│       └── ...
├── domain/                       🗺️ 建立全局理解
│   ├── system-landscape.md      ←  系统全景
│   ├── data-flows.md            ←  数据流向
│   └── processes/               ←  业务流程
│       ├── stage-1-demand-receive.md
│       ├── stage-2-supply-match.md
│       ├── stage-3-bo-lifecycle.md
│       └── ...
└── constraints/                  🚧 改代码前查
    └── constraints.md            ←  统一约束文件
```

三层各自有不同的加载策略：

层

使用模式

何时加载

`reference/`

📖 **查了就走**

AI 遇到陌生字段、术语时按需查阅

`domain/`

🗺️ **建立全局理解**

进入新模块或对接外部系统时一次性加载

`constraints/`

🚧 **改代码前查**

修改业务逻辑前主动扫描，确认有无限制

这个分层对应一个工程判断： **上下文不能全推给 AI——那会爆上下文窗口。** 我们一个业务仓就有几十张表、几百个字段、上百条业务规则，全塞进去 AI 真正要做的事反而被淹没。所以分层不是为了好看，是为了让 AI 按场景按需消费——常用的常驻、稀有的按需查、关键的强制读。

### 我们搭好苗圃，撒下种子，就等它生根发芽

上述我们干的事其实分两步：

**第一步，搭苗圃** —— `contexts/` 、 `rules/` 、 `knowledge/` 三块地各管一摊（项目自画像 / 操作守则 / 领域知识），各有各的加载策略：常用常驻、稀有按需查、关键强制读。

**第二步，撒种子** ——往三块地里填具体内容：一份项目自画像、几条操作守则、7 张字段映射卡片、6 个 stage 主流程。有意思的是,这第一批种子，是 AI 扫了一遍仓库后帮我们撒的。过去我们自己懒得写的东西，AI 几分钟就整理出来了，我们只需审阅和补充。 **文档第一次有了一个会写、会读、写完还真的会用的"人"。**

当你再问一次 AI "批次价状态这个字段从哪来"，AI 不再拍脑袋——它先翻字段映射卡片，再把主流程从头读到尾，最后给出有依据的回答。从"瞎猜"变成了"睁眼"。

但 **种子终究只是种子** 。CLAUDE.md 是项目总览，不是详细手册；守则是几条，不是几十条；字段映射卡片是 7 张，不是 700 张；业务流程是 6 个 stage 主干，不是覆盖所有分支。

还有更多判断埋在人脑——它们没被写下来。指望人永远精力充沛地把它们一条条写下来、再持续维护，是反人性的:这条路撑不久。

那怎么让这些判断在日常工作中被自动捕捉下来，不靠人额外动笔？这是下一节要讲的事情。

---

## L2：吃一堑无妨——难在长一智

让种子自己长出来——AI 自己不会做这件事。

第一次它把字段来源猜错了，你纠正了。第二天新会话换了个新字段，AI 又开始拍脑袋猜来源。你再纠正。第三天又来一个新字段……同一种"不追完整调用链就下结论"的错法，反复出现。

**问题不在它不聪明，而这一次次纠正，没有变成它的"学习"。**

一次纠错只活在那次对话里。对话一关，它就成了聊过的天——没变成它写下次代码前会读到的判断、没变成新会话开局的硬约束、没变成下一次类似场景的反射。再多次，也还是一次次孤立的事件。

**堑只是堑，攒不出智。**

### 写规则不行，你猜不到它会犯什么错

我们最初的反应，和大多数团队一样——那就提前把所有规则写好呗。AI 上来一读完，以后就不会再犯了。

然后发现这条路走不通：

- 你 **猜不到** AI 会犯什么错——很多错是你想都想不到的，得它真犯了你才反应过来"哦还有这种"
- 预写的规则 **命中率极低** ——憋了 50 条，真正派上用场的也就 5 条，剩下 45 条占着上下文却用不到
- 你根本 **不知道该写哪些规则** ——错误还没发生过，你怎么写

问题不在"规则该写得多细"，也不在"规则要写多少条"，而是再退一步、更早的一层：

**规则不该被预设，该被发现。**

**只有真踩过的坑，才长得出有用的规则；想凭空把它们写齐，本身就违背了"长智"的方式。**

### 让种子自己长起来——一条完整的进化河道

既然规则要被发现而不是被预设——那怎么发现？我们造一套AI自主进化的河道。

整条河道是这样的：

开发中 AI 犯错 / 被纠正 / 踩坑

(实时活水,每轮对话一审)

git log 中的 fix: commit 沉积

(历史化石,扫到即比对)

▼

\[skill\] experience-capture 识别信号

① 七视角自查 + 多角度审视

(纠错 / 知识 / 重复 / 决策 / 踩坑 / 字段映射 / 代码模式)

▼

② 零询问写入业务仓本地账本 experiences.jsonl

(append-only JSONL,开发不被打断)

▼

③ 频率阈值判定 → 升格成正式资产:

├── knowledge: ≥1 次 → 立即生效 ├── rule: ≥2 次 → 草稿进 rules/\_draft/ 待审 └── skill: ≥3 次 → 草稿进 skills/\_draft/ 待审

▼

④ 规则自我改写

同类错再犯 ≥ 2 次  
→ 头部追加  
🔄 v2:<原因>

⑤ 知识库代谢(呼吸)

90 天未被引用 → \_archive/  
180 天后 → 彻底淘汰  
permanent → 永不衰减

**信号识别——七个视角，不是七个关键词**  
它不靠听到"你错了"等关键词才触发。每一轮对话，AI 都用七个视角把刚才发生的事主动审一遍——

> 「我刚才答错了吗？」(纠错)  
> 「这里有没有知识库不知道的业务事实？」(知识)  
> 「这个操作我做了第几次了？」(重复)  
> 「这里如果不注意会踩到什么？」(踩坑)  
> 「数据从哪来到哪去？」(映射)  
> 「做 Code Review 我会提什么意见？」(代码)  
> 「这几个文件串起来描述了什么端到端动作？」(流程)

七视角的本质，是把 **被动等纠正** 变成 **主动找疑点** ——AI 不再被你戳醒才记一笔，每一轮都在自查。

**多角度审视——规则不只来自犯错**  
一个值得沉淀的判断，不一定是"我刚才错了"才生出来的。Skill 让 AI 写每条记录前再过一遍多角度清单：防御性、一致性、性能、并发、业务正确性、可维护性、错误处理、团队协作。任何一角发现"以后还会出问题"，都升一条规则。

**账本与阈值——一次是事件，两次是模式，三次是流程**  
信号识别后，零询问写入业务仓本地账本 `experiences.jsonl` 。每一行一条经验：id、时间戳、信号类型、上下文、内容三元组(错的是什么、对的是什么、为什么)、演化状态、置信度。你纠正 AI 的同一秒，账本就多一行。

然后频率阈值自己决定它流向哪个湖：

- **knowledge ≥ 1 次** → 立即生效。领域知识不分试错次数，知道了就该记。
- **rule ≥ 2 次** → 草稿进 `rules/_draft/` 待审。
- **skill ≥ 3 次** → 草稿进 `skills/_draft/` 待审。

**一次是事件，两次是模式，三次是流程** ——下游自己分流。

**沉积层——git fix commit 是错误的化石**

如果对话是河的活水，那 git log 就是沉积层。每一条带有 `fix:` 的代码提交信息都是一次错误的化石：

> `fix: 更新时应 new 新对象只 set 需更新字段,不能用原对象全量 update`  
> `fix: 批量查询忘记分片导致超时`  
> `fix: SQL 未加非空判断导致并发字段覆盖`

每条背后都是一次"上线、报警、半夜紧急修复"的真实代价——团队最贵也被埋得最深的资产，躺了几年从没人整理成"开工前必读"。Skill 扫到 `fix:` 时比对账本，同类 ≥ 2 次升一条 rule 草稿，一行 git 历史从此变成 AI 下次写代码前的硬约束。 **词典从此活在 Git 里，不再活在脑子里。**

**规则也会进化——升格不是终点**

如果一条 rule 已经存在，AI 在新会话里读到了、点头说收到，然后还在犯同类错——这种情况 Skill 不会赖 AI，它判定 **是这条规则的表述出了问题** 。然后机制自己改写：保留原文件，头部追加 `🔄 v2 改写:<原因>` ，把规则越擦越锋利。

**规则不是写完就放在那里的标本，是会随着犯错次数自己长锋的活体。**

**知识库要呼吸——衰减与归档**

只进不出迟早噎死。90 天没被引用过的资产自动进 `_archive/` ，再 90 天彻底淘汰；少数核心 rule 标 `permanent` 永不衰减，其余进入新陈代谢。长期不被使用的规则会稀释注意力、增加检索噪音。

![](https://km.woa.com/asset/00010002260600b24d536293a840d802?height=459&width=774&imageMogr2/thumbnail/1540x%3E/ignore-error/1)

AI读取代码时扫描是否已有相关知识，若没有则写入

七视角、多角度审视、账本积累、阈值分流、git 化石、规则自我改写、知识库代谢——这一整套合起来，组织记忆第一次有了 **机器层面的代谢** 。再问一次"批次价状态从哪来",AI 不再拍脑袋，它读到昨天的纠正记录，给出有据的回答。 **同一种错，第二次不再发生。**

### 利他变利己，激励第一次对齐

回头看这一整套机制最深的价值——不是"AI 学会了多少"。

是 **沉淀知识这件事，第一次从"利他"变成了"利己"** 。

过去——写文档、写规范、留 ADR，全是利他动作：今天我花一小时写下来，未来的人受益，今天的我没有任何即时回报。所以这件事永远排在需求后面，永远等"这波忙完就开始"，永远不开始。和那个永远开不了工的重构计划，是同一个病。

现在——AI 犯了错，你不纠正，它就一直按错的来，你纠正后，这一轮 AI 立刻就按你说的改，并且能自动帮你沉淀下来，下次新会话开局同样的错不再犯。

**写下来这件事，第一次有了即时正反馈。**

不是 AI 让我们突然勤快了，是激励第一次对齐了。一直该做的事，现在终于以一种不痛苦的方式发生了。

经验在账本里安了家，演化成了规则、知识、技能。但 **安家不等于守家——守不住，账本就只是一座空屋** 。

---

## L3：让"应该"变成"不能"，规则的形态演进

前文造的进化机制(AI 每轮 7 视角自查、写入账本、升格成规则),要求 AI 每轮对话"请扫描信号"。然后我们盯着真实会话发现： **AI 读完，开心做完改动，commit 时发现账本里啥也没有。**

它会跳过扫描。

先看一件事——AI 跳过那条规则，不是它笨，也不是它叛逆。它会自我说服"这次可以不做"。

**这些不是 AI 的特殊弱点。**

同样的事，人每天都在做。知道代码写完该测试，"这次算了"。知道该跑回归，"应该不影响"。知道改字段要查上下游，"我记得是上游传的"——然后翻车。

连永不疲倦的 AI 都守不住"应该"，何况人？

### 失败的不是 AI，是规则的形态

哈佛法学教授 Lawrence Lessig 在 1999 年写过一句话："Code is Law"——代码即法律。但 AI 时代我们看到的是比这更深一层：

**Code is Architecture. 代码不是法律，是一堵墙。**

镜头拉回开头那个让我们后背发凉的瞬间：AI 读完"每一轮请扫描"那条 rule，就忘在了脑后。进化机制本身设计得很漂亮，但 **入口仍是一条 rule——请求就有可能被拒** 。

rule 是规则的一种形态，它就像法律，交通法规说"禁止闯红灯"——你可以选择不遵守。但路中间升起一堵墙——你连选择的机会都没有。

我们缺乏一个像墙一样的规则形态，对于一个产品来说，这个形态是 Code，代码决定了产品的一切功能。而对于 AI 来说，这个形态是 Hook。

Hook 是我们自定义的 Shell 脚本，在机械层面强制执行——凡是想让 AI 一定做到的事，都能用 Hook 兜底。

### 先给进化河道焊上两道门禁

回到前文那条进化河道——它有一个致命软肋： **入口是 rule，AI 会跳过** 。我们用 rule「每一轮请扫描信号」要求 AI 主动调用 `experience-capture` skill，结果盯着真实会话发现账本里啥也没新增，它会找各种理由说"这次没什么可记"。

因为光靠 rule 接不住，我们在两个关键时刻各焊了一道 Hook 门禁：

- **会话结束前** （Stop 时机）—— `stop-experience-capture-check.sh` 拦下没扫七视角就想关掉对话的 AI
- **代码提交前** （PreToolUse on git commit）—— `pre-commit-guard.sh` 拦下账本无新增的 AI

将两道门禁补充到进化机制的河道图内，如下所示：

开发中 AI 犯错 / 被纠正 / 踩坑

(实时活水,每轮对话一审)

git log 中的 fix: commit 沉积

(历史化石,扫到即比对)

▼

① 七视角自查 + 多角度审视

(纠错 / 知识 / 重复 / 踩坑 / 字段映射 / 代码模式)

▼

🛑 扫 描 门禁

hook:stop-experience-capture-check.sh

时机:Stop (会话结束前 · 强制托底)

机制:命令式清单 + 执行证明标记

失败:没标记 → 不允许会话结束

▼

② 零询问写入业务仓本地账本 experiences.jsonl

▼

🛑 commit 门禁

hook:pre-commit-guard.sh

时机:PreToolUse on git commit (代码提交前)

机制:物理阻断 (exit 2,模型无法绕过)

GATE-1:本轮 experiences.jsonl 无新增 → 经验漏写,拦下

GATE-2:跨仓影响未标注 \[cross-repo-impact\] → 盲飞,拦下

▼

③ 频率阈值升格 → knowledge / rule / skill

▼

④ 规则自我改写

⑤ 知识库代谢

**扫描门禁（Stop hook）——会话结束前强制托底。** AI 准备结束当前任务时， `stop-experience-capture-check.sh` 直接发命令式清单：① 7 视角逐条扫描 ② 必须输出执行证明标记 ③ 没标记视为未执行，重新走。 **不留它"忘记"的余地。**

**commit 门禁（PreToolUse hook）——代码提交前物理阻断，两道 GATE 串联，缺一不可。** `pre-commit-guard.sh` 在 git commit 前串联两道检查：GATE-1 查 `experiences.jsonl` 本轮有无新增——AI 改了代码却一条经验都没记下？拦。GATE-2 查改动是否碰了 Feign / SDK / Kafka / 共享表却没标 `[cross-repo-impact]` ？拦。

两道门禁把"应该扫描"和"应该记下"从语义建议变成机械事实——AI 跳不过、绕不开。 **任何"应该"，最终都得有一道门禁托底。**

### 五层门禁，守住工作流的每个时机

整个 AI 工作流上，我们一共拼了五层门禁，每层各自接管 AI 一种"偷懒方式"：

① 物理门禁 (动作发生前 · 阻断式,模型无法绕过)

├── commit 门禁 (两道串联检查):

├── **GATE-1:** 经验闸 · 本轮 experiences.jsonl 无新增 → 拦下

└── **GATE-2:** 跨仓闸 · Feign/SDK/Kafka/共享表/跨仓引用 未标注 → 拦下

└── 敏感文件门禁 · 生产配置 /.env / 密钥 /.mcp.json 禁止编辑

② 自动后处理 (动作发生后 · 不阻断,只补正)

└── 编辑后自动格式化 · Java(google-java-format) / XML(xmllint) / JSON(jq) / Python(black);

③ 上下文注入 (对话开局 · 命令式注入到 AI 的工作上下文)

├── 8 种信号清单 · 每轮对话注入,提醒 AI 主动扫描

└── 流程路由 · 首次:完整声明 + 拉 Hub;后续:简短路由

④ 结束拦截 (会话结束前 · 扫描门禁,命令式而非询问式)

└── 7 视角逐条扫 + 必须输出执行证明,没标记 = 没做

⑤ 链式自驱动 (横贯整条工作流 · 多米诺骨牌模式)

└── brainstorming → writing-plans → executing-plans → verification → ec-scan → commit

每步末尾 ⛓️ 链式跳转,不留拍脑袋的口子

五层之间不是平行的—— **硬度从"模型无法绕过"递减到"软提示"** ：第一层物理门禁是底线，第五层链式骨牌是效率上限；中间三层各自负责一类时机。

### 我们建的不是 AI 监狱，是文明的物理基础

Hook 干的事很朴素： **把"应该自律"的部分，变成"无法不自律"的物理门禁。** 应该扫描？变成"不扫描就 commit 不了"。应该想清楚跨仓影响？变成"不标注就提交不了"。

这不是给 AI 立监狱，是给整个工作流补上一直缺失的那块物理地基。 **我们自己也跟着被这套地基托住——门禁是为 AI 立的，也在替我们守住自己。**

**AI 也不是新被告，是老问题的新证人。人会忘、会偷懒、会觉得"这次不会出事"，它不让我们再拿"个人意志薄弱"来搪塞这场已经持续了几千年的失败。**

但门禁也不是万能的。它能管住"该不该"做。 **却管不住你"做没做对"。**

AI 改完代码自信地告诉你"做完了，没问题"——代码看着没问题，编译却挂、或编译过了但运行时出错。这个时候，得用另一种东西拦。

---

## L4："做完了"是一句不可证伪的咒语

"做没做对"——让 AI 自己说，等于没说。

AI 不会故意骗你，但它会 **真诚地犯错** ：它告诉你"做完了"，直到 commit 后 MyBatis XML 里多了一个逗号编译挂掉、或者方法参数因为重载编译能过、却在运行时炸掉。

"做完了"听起来是答案。 **它什么都没说。**

### 1934 年的维也纳早已回答过这个问题

1934 年，哲学家卡尔·波普尔写下一句简单到令人不安的判断： **一个理论如果不能被任何实验推翻，它就不是科学，是信仰** 。

"做完了""测过了""没问题"——这些每天在周会里飘的话语， **全都不可证伪** 。你想反驳它，都不知道从哪儿反驳起。它不是答案，是 **咒语** 。

AI 不是新的不可靠者，只是把老问题撕成了无法再回避的样子——过去也这样汇报、review 点头通过，只是 AI 一天写十几个文件、人一小时审不完，旧秩序一秒就坍塌了。

那就别让 AI 自己说——让它每次改完，出一份 **可以被推翻** 的东西。

### 焊两道闸：编译过 + 改坏的代码能被复现

我们用一个 `/verify` 闭环，每次改完跑编译、跑相关测试、跑 lint，全过才允许 commit。但这是规则，前文已经讲过:AI 会跳过,会自我说服"这次很简单,不必跑"。

所以接着前文焊门禁的思路：commit 门禁上已经焊了 GATE-1(经验闸)、GATE-2(跨仓闸)拦违规； **再串两道 GATE-3、GATE-4 进去，专门验"做没做对"。**

🛑 commit 门禁 (pre-commit-guard.sh,exit 2 物理阻断)

── L3 拦违规(前文已讲)──

GATE-1:经验闸 · 本轮 experiences.jsonl 无新增 → 拦下

GATE-2:跨仓闸 · Feign/SDK/Kafka/共享表未标注 → 拦下

── L4 验正确性(本章新加)──

GATE-3:编译闸 · mvn compile 不过 → 拦下

GATE-4:测试闸 · fix 类 commit 无新增 \*Test.java → 拦下

**GATE-3 编译闸** ——commit 前自动跑 `mvn compile` ，语法和依赖搞坏了拦下。

**GATE-4 测试闸** ——配合 `rules/test-on-failure.md` ，AI 改坏代码或踩了坑后， **修复时必须补一条精确复现该错误的测试** 。GATE-4 检查 fix/bugfix/hotfix 类 commit 是否带新 `*Test.java` ，没有那就拦下。

这样补出来的测试集， **每一条都对应一次真实犯过的错** ——它不是覆盖率，是这个项目的 **伤疤地图** 。一万次成功不能证明对，一次失败可以让我们永远闭住这个口子。

> "做完了"不算数。 **通过编译，通过覆盖错误的新测试，才算数。**

### 事情有轻重之分，不是所有都要做

但每次 commit 都跑全套测试也太重——改一个注释，和改一个 Feign 接口，产生的影响天差地别。所以这道闸不是新增，而是 **给已有的闸装一个判断事情轻重的权利** 。

风险自适应 (pre-commit-guard.sh 自动判定本次变更属哪一级)

① minimal

注释 / javadoc / 纯文档

→ 跳过 GATE-3/4

② low

配置文件 / 资源文件

→ 仅编译

③ high

Service / Mapper / Util 逻辑

→ 编译 + 相关测试

④ critical

Feign / SDK DTO / Kafka /  
SQL DDL / 共享表

→ 编译 + 测试 +  
跨仓兼容性提醒

**让无关紧要的事便宜地通过，让影响深远的事昂贵地通过** ——这是工程秩序里最朴素的一条道理。

### 完成，从此不再是一句声称

把"做完了"砌进证据里——改变的不是验证多了几道闸，是我们对 **"完成"** 的定义。

> **完成 = 变更 + 一份可以被未来推翻的证据。**

这套体系最朴素的两条原则： **机械优于自觉，证据优于声称** 。一句"我改完了"在工程秩序里再也不算数；算数的，是编译过的输出、覆盖错误的新测试、落进档案的那行 JSONL。

---

## 建设 Harness 中央仓库，让三个业务仓同时生效

把规范、技能、检查、知识收进一个中央仓，多个业务仓同时拥有同一份——这就是 Harness 中央仓的全部立意。中央仓不是业务仓，业务代码一行都不进。

整体架构是这样：

<svg viewBox="0 0 720 400" xmlns="http://www.w3.org/2000/svg" style="display:block;max-width:100%;width:100%;height:auto;"><defs><marker id="hubArrV3" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#2c6bbf"></path></marker><marker id="hubArrDeepV3" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#1e4d8b"></path></marker></defs><rect x="40" y="20" width="580" height="140" rx="10" fill="#f5f8fc" stroke="#1e4d8b" stroke-width="1.5"></rect><text x="330" y="44" text-anchor="middle" font-size="15" fill="#1e4d8b" font-family="-apple-system,BlinkMacSystemFont,sans-serif">Harness 中央仓</text> <text x="60" y="70" font-size="11.5" fill="#1e4d8b" font-family="-apple-system,BlinkMacSystemFont,sans-serif">共享层 (通过 symlink 导出 → 业务仓):</text><text x="80" y="93" font-size="13" fill="#1a1a1a" font-family="-apple-system,BlinkMacSystemFont,sans-serif">rules/ skills/ hooks/ commands/</text> <text x="80" y="113" font-size="13" fill="#1a1a1a" font-family="-apple-system,BlinkMacSystemFont,sans-serif">knowledge/ contexts/&lt;业务仓&gt;/</text> <line x1="60" y1="125" x2="600" y2="125" stroke="#cfdcef" stroke-dasharray="3,3"></line><text x="60" y="146" font-size="11" fill="#888" font-family="-apple-system,BlinkMacSystemFont,sans-serif">自用层 (不导出):.claude/ (中央仓自身的 hooks / skills / rules)</text> <line x1="160" y1="160" x2="160" y2="185" stroke="#2c6bbf" stroke-width="1.4"></line><line x1="340" y1="160" x2="340" y2="185" stroke="#2c6bbf" stroke-width="1.4"></line><line x1="520" y1="160" x2="520" y2="185" stroke="#2c6bbf" stroke-width="1.4"></line><text x="340" y="202" text-anchor="middle" font-size="12" fill="#5e7a9d" font-family="-apple-system,BlinkMacSystemFont,sans-serif">下行(读): 6 根 symlink</text> <text x="340" y="220" text-anchor="middle" font-size="10.5" fill="#888" font-family="-apple-system,BlinkMacSystemFont,sans-serif">AI 通过 symlink 直接读到中央仓最新内容</text> <line x1="160" y1="232" x2="160" y2="252" stroke="#2c6bbf" stroke-width="1.4" marker-end="url(#hubArrV3)"></line><line x1="340" y1="232" x2="340" y2="252" stroke="#2c6bbf" stroke-width="1.4" marker-end="url(#hubArrV3)"></line><line x1="520" y1="232" x2="520" y2="252" stroke="#2c6bbf" stroke-width="1.4" marker-end="url(#hubArrV3)"></line><rect x="80" y="252" width="160" height="78" rx="6" fill="#ffffff" stroke="#cfdcef" stroke-width="1.2"></rect><text x="160" y="276" text-anchor="middle" font-size="13" fill="#1a1a1a" font-family="-apple-system,BlinkMacSystemFont,sans-serif">业务仓 1</text><text x="160" y="297" text-anchor="middle" font-size="11" fill="#5e7a9d" font-family="-apple-system,BlinkMacSystemFont,sans-serif">.claude/</text> <text x="160" y="315" text-anchor="middle" font-size="11" fill="#5e7a9d" font-family="-apple-system,BlinkMacSystemFont,sans-serif">CLAUDE.md</text> <rect x="260" y="252" width="160" height="78" rx="6" fill="#ffffff" stroke="#cfdcef" stroke-width="1.2"></rect><text x="340" y="276" text-anchor="middle" font-size="13" fill="#1a1a1a" font-family="-apple-system,BlinkMacSystemFont,sans-serif">业务仓 2</text><text x="340" y="297" text-anchor="middle" font-size="11" fill="#5e7a9d" font-family="-apple-system,BlinkMacSystemFont,sans-serif">.claude/</text> <text x="340" y="315" text-anchor="middle" font-size="11" fill="#5e7a9d" font-family="-apple-system,BlinkMacSystemFont,sans-serif">CLAUDE.md</text> <rect x="440" y="252" width="160" height="78" rx="6" fill="#ffffff" stroke="#cfdcef" stroke-width="1.2"></rect><text x="520" y="276" text-anchor="middle" font-size="13" fill="#1a1a1a" font-family="-apple-system,BlinkMacSystemFont,sans-serif">业务仓 3</text><text x="520" y="297" text-anchor="middle" font-size="11" fill="#5e7a9d" font-family="-apple-system,BlinkMacSystemFont,sans-serif">.claude/</text> <text x="520" y="315" text-anchor="middle" font-size="11" fill="#5e7a9d" font-family="-apple-system,BlinkMacSystemFont,sans-serif">CLAUDE.md</text> <path d="M 600 290 L 640 290 L 640 90 L 622 90" stroke="#1e4d8b" stroke-width="1.6" fill="none" marker-end="url(#hubArrDeepV3)" stroke-dasharray="6,3"></path><text x="648" y="180" font-size="12" fill="#1e4d8b" font-family="-apple-system,BlinkMacSystemFont,sans-serif">⬆ 上行(写)</text> <text x="648" y="200" font-size="10" fill="#5e7a9d" font-family="-apple-system,BlinkMacSystemFont,sans-serif">L2 产出的</text> <text x="648" y="214" font-size="10" fill="#5e7a9d" font-family="-apple-system,BlinkMacSystemFont,sans-serif">rule/skill/</text> <text x="648" y="228" font-size="10" fill="#5e7a9d" font-family="-apple-system,BlinkMacSystemFont,sans-serif">knowledge</text> <text x="648" y="244" font-size="10" fill="#5e7a9d" font-family="-apple-system,BlinkMacSystemFont,sans-serif">写回中央仓</text> <text x="648" y="258" font-size="10" fill="#5e7a9d" font-family="-apple-system,BlinkMacSystemFont,sans-serif">commit/push</text><text x="340" y="358" text-anchor="middle" font-size="11.5" fill="#3c8a4a" font-family="-apple-system,BlinkMacSystemFont,sans-serif">.git/hooks/post-merge: 业务仓每次 git pull 后, 自动进中央仓再 git pull 一次</text> <text x="340" y="378" text-anchor="middle" font-size="10.5" fill="#5e7a9d" font-family="-apple-system,BlinkMacSystemFont,sans-serif">同事昨天写的新规则, 今天就在你的会话里生效</text></svg>

每根 symlink 的具体映射如下——业务仓里的左侧路径，本质上就是中央仓里右侧路径的"另一个名字"：

业务仓里

→ 中央仓里

`.claude/rules/`

`rules/` (操作守则)

`.claude/skills/`

`skills/` (共享 Skill)

`.claude/hooks/`

`hooks/` (五层门禁脚本)

`.claude/commands/`

`commands/` (slash 命令)

`.claude/knowledge/`

`knowledge/` (领域知识)

`CLAUDE.md`

`contexts/<业务仓>/CLAUDE.md` (项目自画像)

> **symlink 的关键性质** ：业务仓内的 rules、skills 是中央仓同名目录的映射，是 **同一份** ——读它就是读中央仓，写它就是写中央仓。

整个体系跑起来是这样：

- **下行(读)** ：业务仓打开会话，AI 通过 symlink 直接读到中央仓的最新内容—— `CLAUDE.md` (项目自画像) → `rules/` (操作守则) → `knowledge/` (领域知识)按需逐层加载。
- **上行(写)** ：业务仓里 L2 进化机制产出的 rule、skill、knowledge，会写回中央仓，中央仓自动 commit / push。
- **传播** ：其他业务仓下次 `git pull` 时， `post-merge` 钩子自动进中央仓再 `git pull` 一次，让中央仓同步到最新——什么都不用做，同事昨天总结的一条新规则今天就在你的会话里生效。

### 一键接入脚本：让六根线一次成型

六根 symlink 加上 `settings.json` 合并、MCP 模板初始化、git hook 安装……手动做大概要二十多步，容易遗漏。我们把它收敛成一个脚本—— `scripts/init-business-repo.sh` ，一行命令搞定。

支持两种模式：

```
# 模式 A: 在中央仓根目录执行,读 business-repos.conf,批量接入所有业务仓
cd <中央仓>/
bash scripts/init-business-repo.sh

# 模式 B: 在业务仓根目录执行,只接入当前业务仓(新仓接入用)
cd <某业务仓>/
bash ../<中央仓>/scripts/init-business-repo.sh
```

脚本一次跑完六步：

步

动作

做了什么

1

自更新中央仓

`git fetch && git pull --ff-only` ，接入前先把中央仓拉到最新

2

MCP 配置兜底

业务仓没有 `.mcp.json` 就从 `templates/.mcp.json.template` 复制一份(含 token 占位符)

3

创建 5 根资产 symlink

`.claude/{rules,skills,hooks,commands,knowledge}` 一次性映射到中央仓同名目录

4

合并共享 hooks

用 `jq` 把中央仓的 `hooks-registry.json` 合并进业务仓的 `.claude/settings.json`

5

装 post-merge hook

`.git/hooks/post-merge` symlink 到中央仓脚本(每次 `git pull` 自动同步中央仓)

6

接入 Contexts

`CLAUDE.md` symlink 到中央仓 `contexts/<业务仓>/CLAUDE.md` (第 6 根 symlink)

最后再跑一遍验证：逐项检查 `experience-capture` skill 是否可达、 `hooks/` 、 `knowledge/` 、`.mcp.json` 、 `CLAUDE.md` 是否都能正常读到——任何一项不通过都会列在失败清单里。

整个脚本最重要的两个性质：

- **幂等可重入** ：每一步都先检查再创建——已存在的 symlink 跳过，已存在的 `.mcp.json` 不覆盖，已合并的 hooks 不重复追加。 **新仓接入和旧仓修复用同一条命令。**
- **零拷贝** ：除了 `.mcp.json` (含 token，各仓独立维护)，业务仓里所有中央仓资产都是 symlink—— **中央仓改完，业务仓下次会话立即生效** ，不需要重新跑脚本，不需要业务仓 commit。

---

## 最后再回到开篇没回答的"Harness 是什么"

L1 到 L4，加上一个把规范、技能、检查、知识都收进同一处的中央仓，我们围绕 Harness 所做的事情做完了。但开篇我们留了一个悬念没回答： **Harness 到底是什么？** 现在该回答了。

Harness Engineering，中文译作"驾驭工程"，是一种 AI 工程化范式，由 HashiCorp 联合创始人 Mitchell Hashimoto 于 2026 年 2 月首次提出。它不强调模型本身的性能，而侧重于通过模型之外的工程环境，来稳定模型在具体场景中的使用效果。其核心哲学被概括为一句话—— **人类掌舵，智能体执行** （Human Steer, Agent Execute）。

业界普遍把 AI 比作一匹野马，Harness 就是给它戴上的缰绳——天马行空、容易跑偏的问题，靠这副缰绳约束与引导。比喻到此为止。

LangChain 给过一个更精确的写法：

> **Agent = Model + Harness**

Harness 在这条公式里指的是 **模型之外的一切代码、配置与执行逻辑** 。它不是模型的一部分，而是把模型嵌入真实工程的那一层壳。

往下追，会发现尽管每个团队的实现千差万别，Harness 的骨架反复回到三件事：

- **上下文（Context）** ：让模型知道当前在做什么、所处的代码与业务背景
- **约束（Constraint）** ：让模型不能越过事先约定的边界
- **反馈（Feedback）** ：让纠错成为规则

这三层不是三种实现，而是三种 **工程职责** 。任何 Harness 落地都会落进这三层里。

Harness

上下文 ── 让模型看见现状

约束 ── 让模型不能越界

反馈 ── 让纠错成为规则

模型

---

### 我们的 L1-L4：把三支柱长在自己土壤里

业界三支柱给的是骨架——任何 Harness 都会落进这三层。但骨架要长成什么样子，取决于团队自己的代码、痛点、AI 用法。我们的 L1 到 L4，就是把这三件事种在三个微服务这块土壤里的一种长法。

业界三支柱

我们的层

对应章节

上下文

L1 看得懂

§L1：在能写之前，它必须先能看见

反馈

L2 学得会

§L2：吃一堑无妨——难在长一智

约束

L3 拦得住

§L3：让"应该"变成"不能"，规则的形态演进

L4 验得了

§L4："做完了"是一句不可证伪的咒语

L3 与 L4 同属"约束"，但形态不同。 **L3 是事前焊死的物理门禁** ——AI 想越线那一刻就被 Hook 拦下，犯错的可能性被前置消除。 **L4 是事后可证伪的验证闭环** ——犯错被允许发生，但"做完了"必须接受证伪，留下编译过的产物和能复现错误的测试。一前一后，构成完整约束。

L1 到 L4 不是四个孤立的层，是一条循环往复的工作流：

<svg viewBox="0 0 720 380" xmlns="http://www.w3.org/2000/svg" style="display:block;max-width:100%;width:100%;height:auto;"><defs><marker id="cycArr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#1e4d8b"></path></marker></defs><rect x="280" y="20" width="160" height="56" rx="8" fill="#f5f8fc" stroke="#1e4d8b" stroke-width="1.5"></rect><text x="360" y="54" text-anchor="middle" font-size="15" fill="#1e4d8b" font-family="-apple-system,BlinkMacSystemFont,sans-serif">L1 看得懂</text> <rect x="540" y="160" width="160" height="56" rx="8" fill="#f5f8fc" stroke="#1e4d8b" stroke-width="1.5"></rect><text x="620" y="194" text-anchor="middle" font-size="15" fill="#1e4d8b" font-family="-apple-system,BlinkMacSystemFont,sans-serif">L2 学得会</text> <rect x="280" y="300" width="160" height="56" rx="8" fill="#f5f8fc" stroke="#1e4d8b" stroke-width="1.5"></rect><text x="360" y="334" text-anchor="middle" font-size="15" fill="#1e4d8b" font-family="-apple-system,BlinkMacSystemFont,sans-serif">L3 拦得住</text> <rect x="20" y="160" width="160" height="56" rx="8" fill="#f5f8fc" stroke="#1e4d8b" stroke-width="1.5"></rect><text x="100" y="194" text-anchor="middle" font-size="15" fill="#1e4d8b" font-family="-apple-system,BlinkMacSystemFont,sans-serif">L4 验得了</text> <path d="M 440 60 Q 540 60 580 160" stroke="#1e4d8b" stroke-width="1.6" fill="none" marker-end="url(#cycArr)"></path><path d="M 580 216 Q 540 318 440 328" stroke="#1e4d8b" stroke-width="1.6" fill="none" marker-end="url(#cycArr)"></path><path d="M 280 328 Q 180 318 140 216" stroke="#1e4d8b" stroke-width="1.6" fill="none" marker-end="url(#cycArr)"></path><path d="M 140 160 Q 180 60 280 50" stroke="#1e4d8b" stroke-width="1.6" fill="none" marker-end="url(#cycArr)"></path><text x="360" y="170" text-anchor="middle" font-size="14" fill="#2c6bbf" font-family="-apple-system,BlinkMacSystemFont,sans-serif">上下文</text> <text x="360" y="200" text-anchor="middle" font-size="14" fill="#2c6bbf" font-family="-apple-system,BlinkMacSystemFont,sans-serif">约束</text> <text x="360" y="230" text-anchor="middle" font-size="14" fill="#2c6bbf" font-family="-apple-system,BlinkMacSystemFont,sans-serif">反馈</text></svg>

AI 接到任务先要 **L1 看得懂** （上下文注入）；写代码时由 **L3 拦得住** 事前焊死红线；产出后由 **L4 验得了** 接受证伪；一旦犯错则由 **L2 学得会** 把纠错沉淀为下次的规则——下一轮 AI 进入项目时，新规则已经在 L1 的上下文里等着它了。三支柱（上下文、约束、反馈）是这条循环里反复出现的内核。

对照表给的只是位置——业界三支柱在我们这里长成什么形态。但有一个更要紧的问题它回答不了：

**为什么 Harness 这条路走通了，而我们计划三年的重构始终没走通？**

---

### Harness 走通的第一件事：每一层都有即时回报

开篇我们说过：那个写了三年的重构计划，一行没动。不是不想做，是它要求一次性投入大量时间，又永远说不清楚什么时候才能看到收益——它永远排在需求后面，永远"等这波忙完就开始"，永远不开始。

Harness 没有要求我们停下来重构。它只是在我们正常做需求的过程中，把缺失的工程基建一层一层补了上去。 **关键在于：每一层都不是为了"以后"，而是当下就有回报。**

- **L1 的回报** ：AI 第一次能写。从那天起，每一行 AI 写的代码都是 L1 的复利——AI 改之前会先翻主流程确认数据从哪来，不再凭字段名猜来源。
- **L2 的回报** ：错误第一次从灾难变成种子。一次踩坑，从此不再发生——昨天 AI 漏掉的边界条件，今天进项目的新会话已经在 rule 里等着它。
- **L3 的回报** ：规则不再依赖人去守。"应该"变成"不能"，犯错的成本被前置——AI 越线那一刻，Hook 直接退回它的修改，不再靠 reviewer 反复提醒。
- **L4 的回报** ："做完了"第一次接受证伪。完成有了客观证据——"改完了"不算数，得附上编译过的产物和能复现错误的测试用例。

重构是把代码全推倒重来。Harness 是把代码周围的工程基建补上。  
前者要求一次性投入。后者每一步都有即时回报。  
前者永远排在需求后面。 **后者长在做需求的过程中。**

**以前 AI 写错是事故，现在 AI 写错是素材。** 心态变了，工作流也跟着变了。

---

### Harness 走通的第二件事：跟 AI 一起进步

但还有一个问题，比"做不动"更隐蔽：在一个模型每个月都在变强的时代，你做的东西凭什么不被自己淘汰？

比方说团队花大力气做了一个 AI 诊断系统，搞了复杂的多 agent 编排才能完成一次 bug 诊断。一个月后模型能力一升级，这套体系瞬间贬值——单个 prompt 就能做的事，何必动用多 agent？这是 AI 时代特殊的"投资恐惧"： **你不知道你做的东西能用多久。** 你刚做好，AI 自己已经把那段功能内化了。

Harness 跨过这道坎的方式不是"做得更快"，而是 **根本不要求一次性做完** 。前文埋过两个观察：

- **提前写一堆规则是没用的。** AI 在进化——你预设的规则要么 AI 根本不会犯那种错，要么这次犯了，下个版本就不犯了。
- **自动产生的规则也会过时。** 当某个错误模式因模型升级而不再出现，曾经救场的那条 rule 也就失去了存在的意义。

所以 L2 的进化河道里有一条 **衰减机制** ：长期不被触发的规则会自动退役。

**AI 进步一寸，规则退役一批；AI 露出新弱点，规则就补一条。**

Harness 不是"建好之后期望长期收益"的东西。它本身就是一个 **跟 AI 齐步走的活体系统** ——AI 在长，它也在长；AI 在变，它也在变。

重构要求一次性投入。自建 AI 工程要求押注模型能力。  
Harness 不要求前者，也不要求后者。  
它 **长在做需求的过程中，活在与 AI 的共进化里** 。

---

### 缰绳的另一端

但走完回头看，发生的事不止于此。

**Harness 表面是约束 AI，内里是把团队的工程默会知识沉淀成文本。** 那些人身上"做得对但说不出来"的判断、反射、经验，过去躺在每个人脑子里，会随人离开。AI 不能读懂反射—— **它只能读文本** 。这件事，构成了一种压力，把这些隐性知识一字一句逼了出来。

- 不是规则在约束 AI，是 AI 在逼团队把规则写下来。
- 不是 Hook 在拦 AI 的手，是 Hook 第一次让"应该"变成"不能"。
- 不是 verify 在审查 AI 的产出，是 verify 第一次让"做完了"接受证伪。

Harness 的最终产物不是一副 AI 的缰绳。 **是一份团队工程默会知识的可读副本。** 它属于团队，不属于模型。

模型会换。会话会断。写下的留下了。

---

本文止于此，但还有两个问题悬着：

- AI 一轮里读到的代码、识别到的流程，真的都被记下来、并在下次任务时被检索、被用上了吗？
- 这套体系跑起来，到底快不快、错得多不多、有没有在变好？

我们下次再来聊聊。

欢迎加入【AI前沿学习交流群】，第一时间获取AI前沿资讯与新课👇🏻

入群链接： [https://nops.woa.com/pigeon/v1/tools/add\_chat?chatId=ww119343313437378](https://nops.woa.com/pigeon/v1/tools/add_chat?chatId=ww119343313437378)

---

更新于：2026-06-08 17:20

标签： [代码](https://km.woa.com/tag/3061/related-articles?current_group_id=52663) [AI](https://km.woa.com/tag/26413/related-articles?current_group_id=52663) [供应链系统](https://km.woa.com/tag/229658/related-articles?current_group_id=52663) [自主提效](https://km.woa.com/tag/232762/related-articles?current_group_id=52663) [Harness](https://km.woa.com/tag/273149/related-articles?current_group_id=52663)

微信扫一扫赞赏

转载

收录

反馈

59

77

13

- [trpc-go-mcp服务枚举的返回值如何指定为字符串？](https://teko.woa.com/mkplus/q/304344?kmref=entry_card)
	TEKO 31阅读 昨天 11:33
- [2026鹅厂Skills大赛获奖作品公示](https://km.woa.com/articles/show/662301?kmref=entry_card)
	文章 3549阅读 6月7日
- [knot workflow iwiki getDocument 参数设置错误，无论填什么都是报错?](https://teko.woa.com/mkplus/q/304331?kmref=entry_card)
	TEKO 31阅读 6月3日
- [我蒸馏我自己之：AI提示词不会写？AI提示词翻译机帮你一键生成专属提示词！\[V1.0.4版更新：6月1日 \]](https://km.woa.com/articles/show/661707?kmref=entry_card)
	文章 1649阅读 6月1日
- [钉钉会议结束后推送的会议纪要图文并茂，清晰完整，腾讯会议和企微里有类似能力吗？](https://km.woa.com/q/view/367633?kmref=entry_card)
	乐问 513阅读 2025年12月12日

![](https://km.woa.com/img/download_openkm.png)

扫一扫安装手机KM