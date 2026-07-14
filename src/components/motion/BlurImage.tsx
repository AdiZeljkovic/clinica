import { useState } from 'react';

interface Props extends React.ImgHTMLAttributes<HTMLImageElement> {
  imgClassName?: string;
}

/* Blur-up reveal na load — čisti CSS transition, bez motion vrijednosti */
export default function BlurImage({ className = '', imgClassName = '', alt = '', ...rest }: Props) {
  const [loaded, setLoaded] = useState(false);
  return (
    <img
      {...rest}
      alt={alt}
      onLoad={e => { setLoaded(true); rest.onLoad?.(e); }}
      className={`${className} ${imgClassName} transition-all duration-700 ease-out ${
        loaded ? 'opacity-100 blur-0 scale-100' : 'opacity-0 blur-md scale-[1.02]'
      }`}
    />
  );
}
