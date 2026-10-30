import { motion, useReducedMotion } from 'framer-motion'
import { useChaos } from '../context/ChaosContext'
import { useSound } from '../context/SoundContext'

const characters = [
  { emoji: '🐄', name: 'Tiny Cow', line: 'Moo. (Translation: this website is your problem now.)', className: 'left-[3%] top-[20%] hidden sm:block', size: 'text-4xl', delay: 0.2, duration: 7 },
  { emoji: '🦆', name: 'Judging Duck', line: 'I saw you click that. I have questions. Mostly about bread.', className: 'right-[5%] top-[16%]', size: 'text-4xl', delay: 0.8, duration: 6.2 },
  { emoji: '👾', name: 'Pixel Gremlin', line: 'Beep boop. Your vibes have been upgraded to "suspicious."', className: 'right-[12%] bottom-[22%] hidden md:block', size: 'text-3xl', delay: 1.4, duration: 8 },
  { emoji: '🧦', name: 'The Lost Sock', line: 'I have been here the whole time. You never looked in the dryer.', className: 'left-[7%] bottom-[18%] hidden sm:block', size: 'text-3xl', delay: 0.5, duration: 6.8 },
  { emoji: '🛸', name: 'Slightly Lost UFO', line: 'We came for intelligent life. We found this website instead.', className: 'left-[45%] top-[8%] hidden lg:block', size: 'text-3xl', delay: 1.9, duration: 9 },
  { emoji: '🍕', name: 'Emotional Support Pizza', line: 'I am not a snack. I am a lifestyle. Please do not eat me.', className: 'right-[2%] bottom-[10%] hidden xl:block', size: 'text-4xl', delay: 1.1, duration: 7.5 },
]

export default function FloatingCharacters({ dense = false }) {
  const { addToast } = useChaos()
  const { play } = useSound()
  const reducedMotion = useReducedMotion()

  const poke = (character) => {
    play('pop')
    addToast(`${character.emoji} ${character.name}: ${character.line}`, 'default', 5000)
    play('moo')
  }

  return (
    <div className="pointer-events-none absolute inset-0 z-[5] overflow-hidden" aria-hidden="false">
      {characters.map((character) => (
        <motion.button
          key={character.name}
          type="button"
          aria-label={`Poke ${character.name}`}
          onClick={() => poke(character)}
          className={`pointer-events-auto absolute ${character.className} ${character.size} drop-shadow-[0_12px_24px_rgba(0,0,0,.4)] focus-visible:opacity-100`}
          initial={{ opacity: 0, scale: 0.4, rotate: -12 }}
          animate={
            reducedMotion
              ? { opacity: 1, scale: 1 }
              : { opacity: 0.92, scale: 1, rotate: [-6, 7, -6], y: [0, -14, 0] }
          }
          transition={{
            opacity: { delay: character.delay, duration: 0.5 },
            scale: { delay: character.delay, duration: 0.5 },
            rotate: { duration: character.duration, repeat: Infinity, ease: 'easeInOut', delay: character.delay },
            y: { duration: character.duration, repeat: Infinity, ease: 'easeInOut', delay: character.delay },
          }}
          whileHover={{ scale: 1.25, rotate: 10, opacity: 1 }}
          whileTap={{ scale: 0.85 }}
          title={character.name}
        >
          {character.emoji}
          {dense && <span className="absolute -bottom-4 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-acid/60" />}
        </motion.button>
      ))}
    </div>
  )
}
