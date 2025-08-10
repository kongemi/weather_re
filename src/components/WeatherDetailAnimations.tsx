import React, { useEffect, useRef } from 'react';
import { useTheme } from '../hooks/useTheme';

interface WeatherDetailAnimationsProps {
  weatherType: string;
  temperature: number;
  humidity: number;
  className?: string;
}

export const WeatherDetailAnimations: React.FC<WeatherDetailAnimationsProps> = ({
  weatherType,
  temperature,
  humidity,
  className = ''
}) => {
  const { isDark } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<any[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 设置画布尺寸
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // 粒子类
    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      color: string;
      life: number;
      maxLife: number;
      angle: number;
      speed: number;
      type: string;

      constructor(x: number, y: number, type: string) {
        this.x = x;
        this.y = y;
        this.life = 0;
        this.maxLife = Math.random() * 200 + 100;
        this.type = type;
        
        // 为所有粒子类型生成真正随机的初始方向
        this.angle = Math.random() * Math.PI * 2;
        
        if (type.includes('晴')) {
          // 阳光粒子 - 慢速随机移动
          this.speed = Math.random() * 0.8 + 0.3;
          this.vx = Math.cos(this.angle) * this.speed + (Math.random() - 0.5) * 0.2;
          this.vy = Math.sin(this.angle) * this.speed + (Math.random() - 0.5) * 0.2;
          this.size = Math.random() * 3 + 1;
          this.color = isDark ? '#fbbf24' : '#f59e0b';
          this.opacity = Math.random() * 0.8 + 0.2;
        } else if (type.includes('雨')) {
          // 雨滴粒子 - 主要向下但有随机偏移
          this.speed = Math.random() * 2 + 1;
          this.vx = (Math.random() - 0.5) * 1.5; // 随机水平偏移
          this.vy = Math.abs(Math.sin(this.angle)) * this.speed + 1; // 主要向下
          this.size = Math.random() * 2 + 1;
          this.color = isDark ? '#60a5fa' : '#3b82f6';
          this.opacity = Math.random() * 0.7 + 0.3;
        } else if (type.includes('雪')) {
          // 雪花粒子 - 缓慢飘落带随机漂移
          this.speed = Math.random() * 0.6 + 0.2;
          this.vx = Math.cos(this.angle) * this.speed + (Math.random() - 0.5) * 0.3;
          this.vy = Math.abs(Math.sin(this.angle)) * this.speed + 0.2; // 轻微向下趋势
          this.size = Math.random() * 4 + 2;
          this.color = isDark ? '#e5e7eb' : '#ffffff';
          this.opacity = Math.random() * 0.8 + 0.2;
        } else if (type.includes('风')) {
          // 风粒子 - 快速随机移动
          this.speed = Math.random() * 2.5 + 1;
          this.vx = Math.cos(this.angle) * this.speed + (Math.random() - 0.5) * 0.5;
          this.vy = Math.sin(this.angle) * this.speed + (Math.random() - 0.5) * 0.5;
          this.size = Math.random() * 1.5 + 0.5;
          this.color = isDark ? '#9ca3af' : '#6b7280';
          this.opacity = Math.random() * 0.6 + 0.2;
        } else {
          // 默认云粒子 - 中速随机移动
          this.speed = Math.random() * 1.2 + 0.4;
          this.vx = Math.cos(this.angle) * this.speed + (Math.random() - 0.5) * 0.3;
          this.vy = Math.sin(this.angle) * this.speed + (Math.random() - 0.5) * 0.3;
          this.size = Math.random() * 3 + 2;
          this.color = isDark ? '#6b7280' : '#9ca3af';
          this.opacity = Math.random() * 0.5 + 0.3;
        }
      }

      update() {
        // 所有粒子类型都有机会改变方向，增加自然感
        if (Math.random() < 0.03) {
          // 随机改变角度
          this.angle += (Math.random() - 0.5) * 0.8;
          
          // 根据粒子类型调整速度变化
          if (this.type.includes('风')) {
            // 风粒子变化更剧烈
            this.vx = Math.cos(this.angle) * this.speed + (Math.random() - 0.5) * 0.8;
            this.vy = Math.sin(this.angle) * this.speed + (Math.random() - 0.5) * 0.8;
          } else if (this.type.includes('雨')) {
            // 雨滴保持向下趋势但有水平偏移
            this.vx += (Math.random() - 0.5) * 0.3;
            this.vy = Math.abs(this.vy) + (Math.random() - 0.5) * 0.2;
          } else if (this.type.includes('雪')) {
            // 雪花轻微调整方向
            this.vx = Math.cos(this.angle) * this.speed + (Math.random() - 0.5) * 0.4;
            this.vy = Math.abs(Math.sin(this.angle)) * this.speed + 0.1;
          } else {
            // 其他粒子随机调整
            this.vx = Math.cos(this.angle) * this.speed + (Math.random() - 0.5) * 0.4;
            this.vy = Math.sin(this.angle) * this.speed + (Math.random() - 0.5) * 0.4;
          }
        }
        
        // 添加微小的随机扰动使运动更自然
        this.vx += (Math.random() - 0.5) * 0.02;
        this.vy += (Math.random() - 0.5) * 0.02;
        
        // 限制速度避免过快
        const maxSpeed = this.type.includes('风') ? 3 : this.type.includes('雨') ? 4 : 2;
        const currentSpeed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        if (currentSpeed > maxSpeed) {
          this.vx = (this.vx / currentSpeed) * maxSpeed;
          this.vy = (this.vy / currentSpeed) * maxSpeed;
        }
        
        this.x += this.vx;
        this.y += this.vy;
        this.life++;
        
        // 生命周期透明度变化
        const lifeRatio = this.life / this.maxLife;
        if (lifeRatio > 0.8) {
          this.opacity *= 0.98;
        }
        
        // 改进的边界处理 - 确保所有方向都能正确包装
        const margin = 20;
        if (this.x < -margin) {
          this.x = canvas.offsetWidth + margin;
        } else if (this.x > canvas.offsetWidth + margin) {
          this.x = -margin;
        }
        
        if (this.y < -margin) {
          this.y = canvas.offsetHeight + margin;
        } else if (this.y > canvas.offsetHeight + margin) {
          this.y = -margin;
        }
        
        // 生命周期检查
        if (this.life > this.maxLife || this.opacity < 0.01) {
          return false;
        }
        return true;
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        
        if (weatherType.includes('雪')) {
          // 绘制雪花形状
          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate((i * Math.PI) / 3);
            ctx.moveTo(0, 0);
            ctx.lineTo(0, -this.size);
            ctx.moveTo(0, -this.size * 0.7);
            ctx.lineTo(-this.size * 0.3, -this.size * 0.9);
            ctx.moveTo(0, -this.size * 0.7);
            ctx.lineTo(this.size * 0.3, -this.size * 0.9);
            ctx.restore();
          }
          ctx.strokeStyle = this.color;
          ctx.lineWidth = 1;
          ctx.stroke();
        } else if (weatherType.includes('雨')) {
          // 绘制雨滴形状
          ctx.beginPath();
          ctx.ellipse(this.x, this.y, this.size * 0.3, this.size, 0, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // 绘制圆形粒子
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fill();
        }
        
        ctx.restore();
      }
    }

    // 创建粒子
    const createParticles = () => {
      const particleCount = Math.min(temperature / 5 + humidity / 10, 50);
      
      for (let i = 0; i < 3; i++) {
        if (particlesRef.current.length < particleCount) {
          let x, y;
          if (weatherType.includes('雨')) {
            x = Math.random() * canvas.offsetWidth;
            y = -10;
          } else {
            // 为其他类型粒子随机选择边缘位置进入
            const edge = Math.floor(Math.random() * 4);
            switch (edge) {
              case 0: // 顶部
                x = Math.random() * canvas.offsetWidth;
                y = -10;
                break;
              case 1: // 右侧
                x = canvas.offsetWidth + 10;
                y = Math.random() * canvas.offsetHeight;
                break;
              case 2: // 底部
                x = Math.random() * canvas.offsetWidth;
                y = canvas.offsetHeight + 10;
                break;
              default: // 左侧
                x = -10;
                y = Math.random() * canvas.offsetHeight;
                break;
            }
          }
          particlesRef.current.push(new Particle(x, y, weatherType));
        }
      }
    };

    // 动画循环
    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      
      // 更新和绘制粒子
      particlesRef.current = particlesRef.current.filter(particle => {
        const alive = particle.update();
        if (alive) {
          particle.draw(ctx);
        }
        return alive;
      });
      
      // 创建新粒子
      createParticles();
      
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [weatherType, temperature, humidity, isDark]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ width: '100%', height: '100%' }}
    />
  );
};

// 温度波浪动画组件
export const TemperatureWave: React.FC<{ temperature: number; className?: string }> = ({
  temperature,
  className = ''
}) => {
  const { isDark } = useTheme();
  
  // 根据温度计算波浪参数
  const waveHeight = Math.min(temperature / 2, 30);
  const waveSpeed = temperature / 10;
  
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div 
        className={`absolute bottom-0 left-0 right-0 opacity-30 ${
          temperature > 25 
            ? 'bg-gradient-to-t from-red-500 to-orange-400'
            : temperature > 15
            ? 'bg-gradient-to-t from-blue-500 to-cyan-400'
            : 'bg-gradient-to-t from-blue-700 to-blue-500'
        }`}
        style={{
          height: `${waveHeight}%`,
          animation: `temperatureWave ${3 / waveSpeed}s ease-in-out infinite`
        }}
      />
      <div 
        className={`absolute bottom-0 left-0 right-0 opacity-20 ${
          temperature > 25 
            ? 'bg-gradient-to-t from-orange-400 to-yellow-300'
            : temperature > 15
            ? 'bg-gradient-to-t from-cyan-400 to-blue-300'
            : 'bg-gradient-to-t from-blue-500 to-indigo-400'
        }`}
        style={{
          height: `${waveHeight * 0.8}%`,
          animation: `temperatureWave ${2.5 / waveSpeed}s ease-in-out infinite reverse`
        }}
      />
    </div>
  );
};

// 数据脉冲动画组件
export const DataPulse: React.FC<{ 
  value: number; 
  maxValue: number; 
  color: string;
  className?: string;
}> = ({ value, maxValue, color, className = '' }) => {
  const percentage = (value / maxValue) * 100;
  
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-0 rounded-full overflow-hidden">
        <div 
          className={`absolute bottom-0 left-0 right-0 transition-all duration-1000 ease-out`}
          style={{
            height: `${percentage}%`,
            background: `linear-gradient(to top, ${color}80, ${color}40)`,
            animation: 'dataPulse 2s ease-in-out infinite'
          }}
        />
      </div>
      <div 
        className="absolute inset-0 rounded-full border-2 opacity-50"
        style={{ borderColor: color }}
      />
    </div>
  );
};

// 3D卡片悬浮动画组件
export const FloatingCard: React.FC<{ 
  children: React.ReactNode;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
}> = ({ children, delay = 0, className = '', style = {} }) => {
  return (
    <div 
      className={`transform transition-all duration-500 hover:scale-105 hover:-translate-y-2 hover:rotate-1 ${className}`}
      style={{
        animation: `floatingCard 4s ease-in-out infinite`,
        animationDelay: `${delay}s`,
        ...style
      }}
    >
      {children}
    </div>
  );
};

// 添加CSS动画到全局样式
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes temperatureWave {
      0%, 100% { transform: translateY(0px) scaleY(1); }
      50% { transform: translateY(-5px) scaleY(1.1); }
    }
    
    @keyframes dataPulse {
      0%, 100% { opacity: 0.6; transform: scale(1); }
      50% { opacity: 1; transform: scale(1.05); }
    }
    
    @keyframes floatingCard {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      33% { transform: translateY(-3px) rotate(0.5deg); }
      66% { transform: translateY(2px) rotate(-0.5deg); }
    }
    
    @keyframes shimmer {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
    
    .shimmer-effect {
      position: relative;
      overflow: hidden;
    }
    
    .shimmer-effect::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
      animation: shimmer 2s infinite;
    }
  `;
  document.head.appendChild(style);
}