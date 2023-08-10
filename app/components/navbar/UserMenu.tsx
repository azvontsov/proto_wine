'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useState, useRef, useEffect } from 'react';
import { signOut } from 'next-auth/react';

import Avatar from '../Avatar';
import { FaGripLines } from 'react-icons/fa';
import MenuItem from './MenuItem';

import useLoginModal from '@/app/hooks/useLoginModal';
import useRegisterModal from '@/app/hooks/useRegisterModal';
import useRentModal from '@/app/hooks/useRentModal';

import { SafeUser } from '@/app/types';

interface UserMenuProps {
  currentUser?: SafeUser | null;
}

const UserMenu: React.FC<UserMenuProps> = ({ currentUser }) => {
  const router = useRouter();
  const loginModal = useLoginModal();
  const registerModal = useRegisterModal();
  const rentModal = useRentModal();

  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = useCallback(() => {
    setIsOpen((value) => !value);
  }, []);

  const menuRef = useRef<HTMLDivElement | null>(null);

  const handleClickOutside = (event: any) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    // listener when the component mounts
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // listener when the component unmounts
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const onRent = useCallback(() => {
    if (!currentUser) {
      return loginModal.onOpen();
    }
    rentModal.onOpen();
  }, [currentUser, loginModal, rentModal]);

  return (
    <div className="relative" ref={menuRef}>
      <div className="flex flex-row items-center gap-3">
        <div
          onClick={onRent}
          className="hidden md:block text-sm font-semibold py-3 px-4 rounded-full hover:bg-neutral-100 transition cursor-pointer"
        >
          Airbnb your home
        </div>
        <div
          onClick={toggleOpen}
          className="toggle-button p-4 md:py-1 md:px-2 border-[1px] border-neutral-#dddddd flex flex-row items-center gap-2 rounded-full cursor-pointer hover:shadow-sm transition"
        >
          <FaGripLines />
          <div className="hidden md:block">
            <Avatar src={currentUser?.image} />
          </div>
        </div>
        <style jsx>{`
          .toggle-button:hover {
            box-shadow: 0 2px 2px rgba(0, 0, 0, 0.08),
              0 4px 12px rgba(0, 0, 0, 0.1);
          }
        `}</style>
      </div>
      {isOpen && (
        <div className="absolute rounded-xl shadow-xl border w-[40vw] md:w-3/4 overflow-hidden right-0 top-12 text-sm">
          <div className="flex flex-col cursor-pointer">
            {currentUser ? (
              <>
                <MenuItem
                  onClick={() => router.push('/trips')}
                  label="My trips"
                />
                <MenuItem
                  onClick={() => router.push('/favorites')}
                  label="My favorites"
                />
                <MenuItem
                  onClick={() => router.push('/reservations')}
                  label="My reservations"
                />
                <MenuItem
                  onClick={() => router.push('/properties')}
                  label="My properties"
                />
                <MenuItem onClick={rentModal.onOpen} label="Airbnb your home" />
                <hr />
                <MenuItem onClick={() => signOut()} label="Logout" />
              </>
            ) : (
              <>
                <MenuItem onClick={loginModal.onOpen} label="Login" />
                <MenuItem onClick={registerModal.onOpen} label="Sign Up" />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
