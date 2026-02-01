<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\VaultController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AuditLogController;

Route::get('/', function () {
    return redirect('/login');
});

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', function () {
        return view('dashboard');
    })->name('dashboard');


    // Vault routes with full CRUD operations
    Route::get('/vault', [VaultController::class, 'index']);
    Route::post('/vault', [VaultController::class, 'store']);
    Route::put('/vault/{id}', [VaultController::class, 'update']);
    Route::delete('/vault/{id}', [VaultController::class, 'destroy']);

    // Audit logs
    Route::get('/audit-logs', [AuditLogController::class, 'index']);

    // Profile routes
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
