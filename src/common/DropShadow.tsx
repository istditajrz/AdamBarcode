export function DropShadow({children } : {children: React.ReactNode}) {
    return <div className='card'>
        <div className='dropshadow'></div>
        <div className='container'>
            {children}
        </div>
    </div>;
}