'use strict'
import opcodes from './opcodes'

export function nameOpCodes (raw) {
  let pushData = ''
  const codeMap = {}
  const code = []

  for (let i = 0; i < raw.length; i++) {
    const pc = i
    const curOpCode = opcodes(raw[pc], false).name
    codeMap[i] = code.length
    // no destinations into the middle of PUSH
    if (curOpCode.slice(0, 4) === 'PUSH') {
      const jumpNum = raw[pc] - 0x5f
      pushData = raw.slice(pc + 1, pc + jumpNum + 1)
      i += jumpNum
    }

    const data = pushData.toString() !== '' ? ' ' + pushData.toString() : ''

    code.push(this.pad(pc, this.roundLog(raw.length, 10)) + ' ' + curOpCode + data)
    pushData = ''
  }
  return [code, codeMap]
}

/**
 * Parses code as a list of integers into a list of objects containing
 * information about the opcode.
 */
export function parseCode (raw) {
  const code = []
  for (let i = 0; i < raw.length; i++) {
    const opcode = opcodes(raw[i], true)
    if (opcode.name.slice(0, 4) === 'PUSH') {
      const length = raw[i] - 0x5f
      opcode['pushData'] = raw.slice(i + 1, i + length + 1)
      // in case pushdata extends beyond code
      if (i + 1 + length > raw.length) {
        for (let j = opcode['pushData'].length; j < length; j++) {
          opcode['pushData'].push(0)
        }
      }
      i += length
    }
    code.push(opcode)
  }
  return code
}

export function pad (num, size) {
  let s = num + ''
  while (s.length < size) s = '0' + s
  return s
}

export function log (num, base) {
  return Math.log(num) / Math.log(base)
}

export function roundLog (num, base) {
  return Math.ceil(this.log(num, base))
}
