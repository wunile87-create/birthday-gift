import '../styles/Sky.css';

// 严格定义 Props 类型，解决报错
interface SkyProps {
  scene: number;
}

function Sky({ scene }: SkyProps) {
  return <div className={`sky-bg scene-${scene}`} />;
}

export default Sky;