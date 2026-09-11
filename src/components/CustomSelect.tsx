import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react'
import { Check, ChevronDown } from 'lucide-react'

export type CustomSelectOption = {
  value: string
  label: string
}

type CustomSelectProps = {
  ariaLabel: string
  value: string
  options: CustomSelectOption[]
  placeholder: string
  onChange: (value: string) => void
  disabled?: boolean
  invalid?: boolean
}

export function CustomSelect({
  ariaLabel,
  value,
  options,
  placeholder,
  onChange,
  disabled = false,
  invalid = false,
}: CustomSelectProps) {
  const listboxId = useId()
  const optionIdPrefix = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const selectedIndex = options.findIndex((option) => option.value === value)
  const [activeIndex, setActiveIndex] = useState(Math.max(selectedIndex, 0))

  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false)
    }

    document.addEventListener('mousedown', closeOnOutsideClick)
    return () => document.removeEventListener('mousedown', closeOnOutsideClick)
  }, [])

  const open = () => {
    if (disabled) return
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0)
    setIsOpen(true)
  }

  const choose = (index: number) => {
    onChange(options[index].value)
    setActiveIndex(index)
    setIsOpen(false)
    requestAnimationFrame(() => triggerRef.current?.focus())
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return

    if (event.key === 'Escape') {
      setIsOpen(false)
      return
    }

    if (event.key === 'Tab') {
      setIsOpen(false)
      return
    }

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      const direction = event.key === 'ArrowDown' ? 1 : -1
      if (!isOpen) {
        open()
        return
      }
      setActiveIndex((current) => (current + direction + options.length) % options.length)
      return
    }

    if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault()
      setIsOpen(true)
      setActiveIndex(event.key === 'Home' ? 0 : options.length - 1)
      return
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      if (isOpen) choose(activeIndex)
      else open()
    }
  }

  const selectedOption = selectedIndex >= 0 ? options[selectedIndex] : undefined

  return (
    <div className={`custom-select ${isOpen ? 'custom-select--open' : ''} ${invalid ? 'custom-select--invalid' : ''}`} ref={rootRef}>
      <button
        ref={triggerRef}
        type="button"
        className="custom-select__trigger"
        role="combobox"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-activedescendant={isOpen ? `${optionIdPrefix}-${activeIndex}` : undefined}
        aria-invalid={invalid || undefined}
        aria-required="true"
        disabled={disabled}
        onClick={() => isOpen ? setIsOpen(false) : open()}
        onKeyDown={handleKeyDown}
      >
        <span className={selectedOption ? '' : 'custom-select__placeholder'}>{selectedOption?.label ?? placeholder}</span>
        <ChevronDown aria-hidden="true" />
      </button>

      {isOpen && (
        <div className="custom-select__menu" id={listboxId} role="listbox" aria-label={ariaLabel}>
          {options.map((option, index) => (
            <button
              type="button"
              id={`${optionIdPrefix}-${index}`}
              role="option"
              aria-selected={value === option.value}
              className={`custom-select__option ${activeIndex === index ? 'custom-select__option--active' : ''}`}
              key={option.value}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => choose(index)}
            >
              <span>{option.label}</span>
              {value === option.value && <Check aria-hidden="true" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
