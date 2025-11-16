// 全局错误处理工具
export class ErrorHandler {
  // 显示错误消息
  static showError(message, error = null) {
    console.error(message, error);
    
    // 在UI上显示错误消息（这里可以集成MDUI的通知组件）
    if (typeof mdui !== 'undefined' && mdui.snackbar) {
      mdui.snackbar({
        message: message,
        timeout: 3000,
        buttonText: '关闭',
        onButtonClick: () => {},
        onClose: () => {}
      });
    } else {
      // 降级处理：使用浏览器原生alert
      alert(`错误: ${message}`);
    }
  }

  // 处理异步错误
  static async handleAsyncOperation(operation, successMessage = '操作成功', errorMessage = '操作失败') {
    try {
      const result = await operation();
      console.log(successMessage);
      return result;
    } catch (error) {
      this.showError(errorMessage, error);
      throw error;
    }
  }

  // 验证输入数据
  static validateInput(data, rules) {
    const errors = [];
    
    for (const [field, rule] of Object.entries(rules)) {
      const value = data[field];
      
      if (rule.required && (!value || value.trim().length === 0)) {
        errors.push(`${rule.label || field} 是必填项`);
      }
      
      if (value && rule.minLength && value.length < rule.minLength) {
        errors.push(`${rule.label || field} 至少需要 ${rule.minLength} 个字符`);
      }
      
      if (value && rule.maxLength && value.length > rule.maxLength) {
        errors.push(`${rule.label || field} 不能超过 ${rule.maxLength} 个字符`);
      }
      
      if (value && rule.pattern && !rule.pattern.test(value)) {
        errors.push(`${rule.label || field} 格式不正确`);
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// 本地存储错误处理
export class StorageErrorHandler {
  // 安全获取本地存储数据
  static getItem(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      ErrorHandler.showError(`获取本地存储数据失败: ${key}`, error);
      return defaultValue;
    }
  }

  // 安全设置本地存储数据
  static setItem(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      if (error.name === 'QuotaExceededError') {
        ErrorHandler.showError('存储空间不足，请清理部分数据');
      } else {
        ErrorHandler.showError(`保存数据失败: ${key}`, error);
      }
      throw error;
    }
  }

  // 安全删除本地存储数据
  static removeItem(key) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      ErrorHandler.showError(`删除数据失败: ${key}`, error);
    }
  }
}