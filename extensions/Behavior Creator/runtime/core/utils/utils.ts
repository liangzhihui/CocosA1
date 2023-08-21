/*
 * @Author: OreoWang
 * @Email: ihc523@163.com
 * @Date: 2022-03-22 21:29:32
 * @LastEditors: OreoWang
 * @LastEditTime: 2022-03-22 17:20:11
 * @Description: 
 */

// const SHOW_LOG = true;

export const utils = {
	// log: SHOW_LOG?console.log.bind(console, "[LOG]"):()=>{},
    // warn: SHOW_LOG?console.warn.bind(console, "[WARN]"):()=>{},
    // error: SHOW_LOG?console.error.bind(console, "[ERROR]"):()=>{},
	// debug: SHOW_LOG?console.debug.bind(console, "[DEBUG]"):()=>{},

	/**
		 * 判断变量类型是否是字符串
		 */
	isString: function (val) {
		return typeof val === 'string'
	},

	/**
	 * 判断变量类型是否是布尔值
	 */
	isBoolean: function (val) {
		return typeof val === 'boolean'
	},

	/**
	 * 判断变量类型是否是数值
	 */
	isNumber: function (val) {
		return typeof val === 'number'
	},

	/**
	 * 改进typeof
	 */
	typeOf: function (value) {
		let s = typeof value
		if (s === 'object') {
			if (value) {
				if (value instanceof Array) {
					return 'array'
				} else if (value instanceof Object) {
					return s
				}

				let className = Object.prototype.toString.call(/** @type {!Object} */(value))
				if (className === '[object Window]') {
					return 'object'
				}

				// 判断是否为数组类型
				if (className === '[object Array]' ||
					(typeof value.length === 'number' &&
						typeof value.splice !== 'undefined' &&
						typeof value.propertyIsEnumerable !== 'undefined' &&
						!value.propertyIsEnumerable('splice'))) {
					return 'array'
				}

				// 判断是否为函数类型
				if (className === '[object Function]' ||
					(typeof value.call !== 'undefined' &&
						typeof value.propertyIsEnumerable !== 'undefined' &&
						!value.propertyIsEnumerable('call'))) {
					return 'function'
				}
			} else {
				return 'null'
			}
		} else if (s === 'function' && typeof value.call === 'undefined') {
			return 'object'
		}
		return s
	},
	/**
	 * 判断是否为空
	 */
	isNull: function (val) {
		return val == null
	},

	
    /**
     * 判断是否为函数
     */
	 isFunction: function (val) {
		return utils.typeOf(val) === 'function'
	  },
  
	/**
	 * 判断是否为对象
	 */
	isObject: function (val) {
		var type = typeof val
		return (type === 'object' && val != null) || type === 'function'
	},


	/**
		* 定义属性
		* @param obj
		* @param key
		* @param val
		* @param enumerable
		*/
	def: function (obj, key, val, enumerable = false) {
		if(!utils.isObject(obj)) return;

		Object.defineProperty(obj, key, {
			value: val,
			enumerable: !!enumerable,
			writable: true,
			configurable: true
		})
	},

	/**
	 * 深度拷贝
	 */
	clone(obj) {
		if (null == obj || "object" != typeof obj) return obj;

		if (obj instanceof Array || obj instanceof Object) {
			var copy = (obj instanceof Array) ? [] : {};
			for (var attr in obj) {
				if (obj.hasOwnProperty(attr))
					copy[attr] = this.clone(obj[attr]);
			}
			return copy;
		}

		return obj
	},
}