#!/usr/bin/env python3
import ftplib
import os
from pathlib import Path

# Configuration FTP
FTP_HOST = "ftp.cluster030.hosting.ovh.net"
FTP_USER = "ziggi-create"
FTP_PASS = "e98kHUxZbv9ksq"
FTP_REMOTE_DIR = "www"
LOCAL_DIR = "/Users/user/Documents/Développement/Create(Canva-like)/frontend/dist"

def upload_directory(ftp, local_dir, remote_dir):
    """Upload recursively all files from local_dir to remote_dir"""
    local_path = Path(local_dir)

    for item in local_path.rglob('*'):
        if item.is_file():
            # Calculate relative path
            relative_path = item.relative_to(local_path)
            remote_path = str(Path(remote_dir) / relative_path).replace('\\', '/')

            # Create remote directories if needed
            remote_dir_path = str(Path(remote_path).parent).replace('\\', '/')
            try:
                ftp.cwd(remote_dir_path)
            except ftplib.error_perm:
                # Directory doesn't exist, create it
                dirs = remote_dir_path.split('/')
                current = ''
                for d in dirs:
                    if d:
                        current += '/' + d
                        try:
                            ftp.mkd(current)
                            print(f"Created directory: {current}")
                        except ftplib.error_perm:
                            pass  # Directory already exists

            # Upload file
            print(f"Uploading {relative_path}...")
            with open(item, 'rb') as file:
                ftp.storbinary(f'STOR {remote_path}', file)
            print(f"✓ Uploaded {relative_path}")

def main():
    print(f"🚀 Connecting to {FTP_HOST}...")

    try:
        # Connect to FTP
        ftp = ftplib.FTP(FTP_HOST, timeout=30)
        ftp.login(FTP_USER, FTP_PASS)
        print(f"✓ Connected as {FTP_USER}")

        # Change to remote directory
        try:
            ftp.cwd(FTP_REMOTE_DIR)
        except ftplib.error_perm:
            ftp.mkd(FTP_REMOTE_DIR)
            ftp.cwd(FTP_REMOTE_DIR)

        print(f"✓ Changed to remote directory: {FTP_REMOTE_DIR}")

        # Upload files
        upload_directory(ftp, LOCAL_DIR, FTP_REMOTE_DIR)

        # Close connection
        ftp.quit()
        print("\n✅ Deployment completed successfully!")

    except ftplib.error_perm as e:
        print(f"❌ FTP Permission Error: {e}")
        print("Please check your FTP credentials and permissions.")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    main()
