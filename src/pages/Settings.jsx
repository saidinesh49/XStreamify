import React, { useState } from 'react';
import { useUserContext } from '../context/UserContext';
import { toast } from 'react-toastify';
import { changePassword, updateAvatar, updateCoverImage, updateAccountDetails } from '../services/settingsService';
import { Upload, Key, Image, User } from 'lucide-react';
import Loading from '../components/Loading';

export default function Settings() {
	const { userData, addUserData } = useUserContext();
	const [isLoading, setIsLoading] = useState(false);
	const [message, setMessage] = useState({ type: '', content: '' });

	// Account details states
	const [accountData, setAccountData] = useState({
		fullName: userData?.fullName || '',
		email: userData?.email || ''
	});

	// Password change states
	const [passwordData, setPasswordData] = useState({
		oldPassword: '',
		newPassword: '',
		confirmPassword: ''
	});

	// File states
	const [avatarFile, setAvatarFile] = useState(null);
	const [coverImageFile, setCoverImageFile] = useState(null);
	const [avatarPreview, setAvatarPreview] = useState(userData?.avatar);
	const [coverPreview, setCoverPreview] = useState(userData?.coverImage);

	const handleAccountUpdate = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		try {
			const response = await updateAccountDetails(accountData.fullName, accountData.email);
			addUserData({ ...userData, ...response.data });
			toast.success('Account details updated successfully!', {
				icon: '✅'
			});
			setMessage({ type: 'success', content: 'Account details updated successfully' });
		} catch (error) {
			toast.error(error.response?.data?.message || 'Failed to update account details', {
				icon: '⚠️'
			});

			setMessage({ type: 'error', content: error.response?.data?.message || 'Failed to update account details' });
		}
		setIsLoading(false);
	};

	const handlePasswordChange = async (e) => {
		e.preventDefault();
		if (passwordData.newPassword !== passwordData.confirmPassword) {
			toast.error('New passwords do not match!', {
				icon: '❌'
			});
			setMessage({ type: 'error', content: 'New passwords do not match' });
			return;
		}

		setIsLoading(true);
		try {
			await changePassword(passwordData.oldPassword, passwordData.newPassword);
			toast.success('Password updated successfully!', {
				icon: '🔒'
			});
			setMessage({ type: 'success', content: 'Password changed successfully' });
			setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
		} catch (error) {
			toast.error(error.response?.data?.message || 'Failed to update password. Please try again.', {
				icon: '⚠️'
			});

			setMessage({ type: 'error', content: error.response?.data?.message || 'Failed to change password' });
		}
		setIsLoading(false);
	};

	const handleAvatarChange = async (e) => {
		const file = e.target.files[0];
		if (file) {
			setAvatarFile(file);
			setAvatarPreview(URL.createObjectURL(file));
		}
	};

	const handleCoverImageChange = async (e) => {
		const file = e.target.files[0];
		if (file) {
			setCoverImageFile(file);
			setCoverPreview(URL.createObjectURL(file));
		}
	};

	const handleAvatarUpload = async () => {
		if (!avatarFile) return;
		setIsLoading(true);
		try {
			const response = await updateAvatar(avatarFile);
			addUserData({ ...userData, avatar: response.data.avatar });
			toast.success('Profile picture updated successfully!', {
				icon: '🖼️'
			});
			setMessage({ type: 'success', content: 'Avatar updated successfully' });
		} catch (error) {
			toast.error('Failed to update profile picture.', {
				icon: '⚠️'
			});

			setMessage({ type: 'error', content: 'Failed to update avatar' });
		}
		setIsLoading(false);
	};

	const handleCoverImageUpload = async () => {
		if (!coverImageFile) return;
		setIsLoading(true);
		try {
			const response = await updateCoverImage(coverImageFile);
			addUserData({ ...userData, coverImage: response.data.coverImage });
			toast.success('Cover image updated successfully!', {
				icon: '🖼️'
			});
			setMessage({ type: 'success', content: 'Cover image updated successfully' });
		} catch (error) {
			toast.error('Failed to update cover image. Please try again.', {
				icon: '⚠️'
			});

			setMessage({ type: 'error', content: 'Failed to update cover image' });
		}
		setIsLoading(false);
	};

	return (
		<div className="max-w-4xl mx-auto p-4 space-y-8 pt-20">
			<h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Settings</h1>

			{message.content && (
				<div className={`p-4 rounded-lg ${
					message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
				}`}>
					{message.content}
				</div>
			)}

			{/* Account Details Section */}
			<section className="bg-white dark:bg-surface-800 rounded-lg p-6 shadow-sm">
				<h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
					<User className="w-5 h-5" />
					Account Details
				</h2>
				<form onSubmit={handleAccountUpdate} className="space-y-4">
					<div>
						<label className="block text-sm font-medium mb-1">Full Name</label>
						<input
							type="text"
							value={accountData.fullName}
							onChange={(e) => setAccountData({...accountData, fullName: e.target.value})}
							className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-surface-700 dark:border-surface-600"
							required
						/>
					</div>
					<div>
						<label className="block text-sm font-medium mb-1">Email</label>
						<input
							type="email"
							value={accountData.email}
							onChange={(e) => setAccountData({...accountData, email: e.target.value})}
							className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-surface-700 dark:border-surface-600"
							required
						/>
					</div>
					<button
						type="submit"
						disabled={isLoading}
						className="w-full py-2 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
					>
						{isLoading ? <Loading /> : 'Update Account Details'}
					</button>
				</form>
			</section>

			{/* Password Change Section */}
			<section className="bg-white dark:bg-surface-800 rounded-lg p-6 shadow-sm">
				<h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
					<Key className="w-5 h-5" />
					Change Password
				</h2>
				<form onSubmit={handlePasswordChange} className="space-y-4">
					<div>
						<label className="block text-sm font-medium mb-1">Current Password</label>
						<input
							type="password"
							value={passwordData.oldPassword}
							onChange={(e) => setPasswordData({...passwordData, oldPassword: e.target.value})}
							className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-surface-700 dark:border-surface-600"
							required
						/>
					</div>
					<div>
						<label className="block text-sm font-medium mb-1">New Password</label>
						<input
							type="password"
							value={passwordData.newPassword}
							onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
							className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-surface-700 dark:border-surface-600"
							required
						/>
					</div>
					<div>
						<label className="block text-sm font-medium mb-1">Confirm New Password</label>
						<input
							type="password"
							value={passwordData.confirmPassword}
							onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
							className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-surface-700 dark:border-surface-600"
							required
						/>
					</div>
					<button
						type="submit"
						disabled={isLoading}
						className="w-full py-2 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
					>
						{isLoading ? <Loading /> : 'Update Password'}
					</button>
				</form>
			</section>

			{/* Profile Picture Section */}
			<section className="bg-white dark:bg-surface-800 rounded-lg p-6 shadow-sm">
				<h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
					<Upload className="w-5 h-5" />
					Profile Picture
				</h2>
				<div className="space-y-4">
					<div className="flex items-center gap-4">
						<img
							src={avatarPreview || 'https://via.placeholder.com/150'}
							alt="Profile"
							className="w-24 h-24 rounded-full object-cover"
						/>
						<div className="flex-1">
							<input
								type="file"
								accept="image/*"
								onChange={handleAvatarChange}
								className="hidden"
								id="avatar-upload"
							/>
							<label
								htmlFor="avatar-upload"
								className="block w-full px-4 py-2 text-center border-2 border-dashed rounded-lg cursor-pointer hover:border-primary-500 transition-colors"
							>
								Choose new picture
							</label>
						</div>
					</div>
					{avatarFile && (
						<button
							onClick={handleAvatarUpload}
							disabled={isLoading}
							className="w-full py-2 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
						>
							{isLoading ? <Loading /> : 'Upload Profile Picture'}
						</button>
					)}
				</div>
			</section>

			{/* Cover Image Section */}
			<section className="bg-white dark:bg-surface-800 rounded-lg p-6 shadow-sm">
				<h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
					<Image className="w-5 h-5" />
					Cover Image
				</h2>
				<div className="space-y-4">
					<div className="relative">
						<img
							src={coverPreview || 'https://via.placeholder.com/1200x300'}
							alt="Cover"
							className="w-full h-48 object-cover rounded-lg"
						/>
						<input
							type="file"
							accept="image/*"
							onChange={handleCoverImageChange}
							className="hidden"
							id="cover-upload"
						/>
						<label
							htmlFor="cover-upload"
							className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 hover:opacity-100 transition-opacity cursor-pointer rounded-lg"
						>
							Choose new cover image
						</label>
					</div>
					{coverImageFile && (
						<button
							onClick={handleCoverImageUpload}
							disabled={isLoading}
							className="w-full py-2 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
						>
							{isLoading ? <Loading /> : 'Upload Cover Image'}
						</button>
					)}
				</div>
			</section>
		</div>
	);
}