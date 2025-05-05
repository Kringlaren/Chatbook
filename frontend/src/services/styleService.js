export const getCssVariable = (name) => {
    const style = getComputedStyle(document.documentElement);
    return style.getPropertyValue(name).trim();
};

export const getAllDefaultColors = () => {
    return {
        bg_color: getCssVariable('--primary-color'),
        text_color: getCssVariable('--text-color'),
        detail_color: getCssVariable('--detail-color'),
        link_color: getCssVariable('--link-color'),
    };
};

export const applyColors = (preferences) => {
    const root = document.documentElement;
      
    const { bg_color, text_color, detail_color, link_color } = preferences;
    
    if (bg_color) root.style.setProperty('--primary-color', bg_color);
    if (text_color) root.style.setProperty('--text-color', text_color);
    if (detail_color) root.style.setProperty('--detail-color', detail_color);
    if (link_color) root.style.setProperty('--link-color', link_color);
};