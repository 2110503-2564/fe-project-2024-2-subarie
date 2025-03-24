import styles from './topmenu.module.css'
import Image from 'next/image'
import TopMenuItem from './TopMenuItem';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions'
import NextLink from 'next/link';

export default async function TopMenu(){
    const session = await getServerSession(authOptions)

    return (
        <div className={styles.menucontainer}>
            {/* Sign-in/Sign-out on the left side */}
            <div className={styles.leftSide}>
                {session 
                    ? (
                        <>
                            <span className={styles.username}>{session.user?.name}</span>
                            <NextLink href="/api/auth/signout?callbackUrl=/" className={styles.menuItem}>
                                Sign-Out
                            </NextLink>
                            <TopMenuItem title='My Profile' pageRef='/account/profile'/>
                            <TopMenuItem title='My Reservations' pageRef='/myreservations'/>
                        </>
                    ) 
                    : (
                        <>
                            <NextLink href="/api/auth/signin?callbackUrl=/" className={styles.menuItem}>
                                Sign-In
                            </NextLink>
                            <NextLink href="/register" className={styles.menuItem}>
                                Register
                            </NextLink>
                        </>
                    )
                }
            </div>
            
            {/* Right side with navigation items and logo */}
            <div className={styles.rightSide}>
                <TopMenuItem title='About' pageRef='/about'/>
                <TopMenuItem title='Fleet' pageRef='/venue'/>
                <TopMenuItem title='Services' pageRef='/about'/>
                <TopMenuItem title='Reserve' pageRef='/booking'/>
                <NextLink href="/">
                    <div className={styles.logowrapper}>
                        <Image 
                            src={'/img/crest-logo.png'}
                            className={styles.logoimg}
                            alt='logo'
                            width={40}
                            height={40}
                            style={{ objectFit: 'contain' }}
                        />
                    </div>
                </NextLink>
            </div>
        </div>
    );
}