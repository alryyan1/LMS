import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import { Eye, EyeOff } from 'lucide-react';
import axiosClient from '../../axios-client';
import { useTranslation } from 'react-i18next';

interface PasswordChangeFormData {
  old_password: string;
  new_password: string;
  confirm_password: string;
}


const PasswordChangeForm = () => {
  const { t } = useTranslation('changePassword');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<PasswordChangeFormData>();

  const onSubmit = (data: PasswordChangeFormData) => {
    // Simulate API call to update password
    console.log('Password updated:', data);
    ///change-password with axios
    axiosClient.post(`change-password`,data).then(({data})=>{
        console.log(data,'data')
    })

  };

  const newPassword = watch('new_password');

  const togglePasswordVisibility = (field: 'old' | 'new' | 'confirm') => {
    switch (field) {
      case 'old':
        setShowOldPassword(!showOldPassword);
        break;
      case 'new':
        setShowNewPassword(!showNewPassword);
        break;
      case 'confirm':
        setShowConfirmPassword(!showConfirmPassword);
        break;
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-1">
      <TextField
        fullWidth
        label={t('oldPasswordLabel')}
        type={showOldPassword ? 'text' : 'password'}
        error={!!errors.old_password}
        helperText={errors.old_password?.message}
        {...register('old_password', {
          required: t('oldPasswordRequired'),
          minLength: {
            value: 4,
            message: t('passwordMinLength', { count: 4 }),
          },
        })}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => togglePasswordVisibility('old')}
                edge="end"
              >
                {showOldPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <TextField
        fullWidth
        label={t('newPasswordLabel')}
        type={showNewPassword ? 'text' : 'password'}
        error={!!errors.new_password}
        helperText={errors.new_password?.message}
        {...register('new_password', {
          required: t('newPasswordRequired'),
          minLength: {
            value: 4,
             message: t('passwordMinLength', { count: 4 }),
          },
        })}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => togglePasswordVisibility('new')}
                edge="end"
              >
                {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <TextField
        fullWidth
        label={t('confirmNewPasswordLabel')}
        type={showConfirmPassword ? 'text' : 'password'}
        error={!!errors.confirm_password}
        helperText={errors.confirm_password?.message}
        {...register('confirm_password', {
          required: t('confirmNewPasswordRequired'),
          validate: (value) =>
            value === newPassword || t('passwordMismatch'),
        })}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => togglePasswordVisibility('confirm')}
                edge="end"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Button
        type="submit"
        variant="contained"
        fullWidth
        size="large"
        sx={{ mt: 3 }}
      >
        {t('changePasswordButton')}
      </Button>
    </form>
  );
};

export default PasswordChangeForm;