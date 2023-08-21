/*
 * @Author: OreoWang
 * @Email: ihc523@163.com
 * @Date: 2022-03-22 21:29:32
 * @LastEditors: OreoWang
 * @LastEditTime: 2022-03-22 17:20:11
 * @Description: 
 */

const SHOW_LOG = true;

export const logger = {
	log: SHOW_LOG?console.log.bind(console, "[LOG]"):()=>{},
    warn: SHOW_LOG?console.warn.bind(console, "[WARN]"):()=>{},
    error: SHOW_LOG?console.error.bind(console, "[ERROR]"):()=>{},
	debug: SHOW_LOG?console.debug.bind(console, "[DEBUG]"):()=>{},
}