/**
 * 作品集配置：将图片放入 assets/project-1 | project-2 | project-3
 * 命名 01.jpg ~ 10.jpg（支持 jpg/png/webp）
 */
const PROJECTS = [
  {
    id: 1,
    slug: "project-1",
    title: "Flow 生活",
    subtitle: "移动端 · 效率工具 App",
    type: "mobile",
    typeLabel: "手机 App",
    year: "2025.03",
    intro:
      "面向都市年轻用户的轻量效率工具，聚焦「今日三件事」与习惯打卡。界面以留白与层级引导注意力，降低认知负担。",
    concept:
      "以「流动的时间」为隐喻：主界面采用纵向时间轴，配合蓝紫点缀标识当前焦点任务。图标与控件统一 2px 圆角与 8pt 栅格，保证小屏下的触控舒适度与品牌识别度。",
    colors: ["#e8e8ec", "#5c5c6e", "#6d28ff"],
    folder: "project-1",
  },
  {
    id: 2,
    slug: "project-2",
    title: "Nexus 控制台",
    subtitle: "电脑端 · B 端数据平台",
    type: "desktop",
    typeLabel: "电脑端",
    year: "2024.11",
    intro:
      "企业级数据运营后台的重设计，覆盖仪表盘、报表配置与权限管理。在信息密度与可读性之间取得平衡。",
    concept:
      "采用深色侧栏 + 浅灰内容区的双区结构，高饱和蓝紫仅用于关键指标与可操作状态。表格与图表遵循 12 列栅格，统一 14px 正文与 600 字重标题形成清晰的信息层级。",
    colors: ["#f0f0f2", "#3d3d48", "#7c3aed"],
    folder: "project-2",
  },
  {
    id: 3,
    slug: "project-3",
    title: "Atelier 官网",
    subtitle: "电脑端 · 品牌展示站",
    type: "desktop",
    typeLabel: "电脑端",
    year: "2024.06",
    intro:
      "独立设计工作室的品牌官网，强调作品叙事与预约转化。整站以黑白摄影与界面截图交替，营造克制而高级的视觉节奏。",
    concept:
      "首页仅保留文字与细线分隔，滚动后以大画幅作品切入。蓝紫色作为唯一强调色，用于 CTA 与悬停态，避免干扰作品本身的色彩表达。",
    colors: ["#fafafa", "#52525b", "#5b21b6"],
    folder: "project-3",
  },
];

function buildPlaceholder(project, index) {
  const [c1, c2, c3] = project.colors;
  const isMobile = project.type === "mobile";
  const w = isMobile ? 390 : 960;
  const h = isMobile ? 844 : 600;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${c1}"/>
        <stop offset="55%" stop-color="${c2}"/>
        <stop offset="100%" stop-color="${c3}"/>
      </linearGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#g)"/>
    <text x="${w / 2}" y="${h / 2 - 12}" text-anchor="middle" fill="rgba(255,255,255,0.85)" font-family="PingFang SC,sans-serif" font-size="${isMobile ? 18 : 24}" font-weight="600">${project.title}</text>
    <text x="${w / 2}" y="${h / 2 + 22}" text-anchor="middle" fill="rgba(255,255,255,0.45)" font-family="PingFang SC,sans-serif" font-size="13" font-weight="300">${String(index).padStart(2, "0")} · 替换为本地图片</text>
  </svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function getProjectImages(project) {
  return Array.from({ length: 10 }, (_, i) => {
    const n = String(i + 1).padStart(2, "0");
    return {
      src: `assets/${project.folder}/${n}.jpg`,
      alt: `${project.title} 作品 ${i + 1}`,
      fallback: buildPlaceholder(project, i + 1),
    };
  });
}
