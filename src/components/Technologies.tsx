import { useTranslation } from 'react-i18next'
import { useScrollReveal } from '../hooks/useScrollReveal'

const TECHNOLOGIES = [
  { name: 'React', color: '#61dafb' },
  { name: 'Vue.js', color: '#42b883' },
  { name: 'Angular', color: '#dd0031' },
  { name: 'Next.js', color: '#ffffff' },
  { name: 'Node.js', color: '#68a063' },
  { name: 'TypeScript', color: '#3178c6' },
  { name: 'Python', color: '#ffd43b' },
  { name: '.NET', color: '#512bd4' },
  { name: 'Java', color: '#f89820' },
  { name: 'PHP', color: '#777bb4' },
  { name: 'Flutter', color: '#02569b' },
  { name: 'React Native', color: '#61dafb' },
  { name: 'Swift', color: '#fa7343' },
  { name: 'Kotlin', color: '#7f52ff' },
  { name: 'PostgreSQL', color: '#336791' },
  { name: 'MongoDB', color: '#47a248' },
  { name: 'Redis', color: '#dc382d' },
  { name: 'Docker', color: '#2496ed' },
  { name: 'Kubernetes', color: '#326ce5' },
  { name: 'AWS', color: '#ff9900' },
  { name: 'Azure', color: '#0078d4' },
  { name: 'GraphQL', color: '#e10098' },
  { name: 'TensorFlow', color: '#ff6f00' },
  { name: 'Figma', color: '#f24e1e' },
]

export function Technologies() {
  const { t } = useTranslation()
  const ref = useScrollReveal()
  const doubled = [...TECHNOLOGIES, ...TECHNOLOGIES]

  return (
    <section className="section" id="technologie" aria-labelledby="tech-title">
      <div className="section__container" ref={ref}>
        <div className="section__header">
          <span className="section__label">{t('tech.label')}</span>
          <h2 id="tech-title" className="section__title">
            {t('tech.title')}
          </h2>
          <p className="section__description">
            {t('tech.description')}
          </p>
        </div>
      </div>

      <div className="tech__track-wrapper" aria-hidden="true">
        <div className="tech__track">
          {doubled.map((tech, i) => (
            <div key={`${tech.name}-${i}`} className="tech__item">
              <span
                className="tech__item-dot"
                style={{ color: tech.color, background: tech.color }}
              />
              {tech.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
