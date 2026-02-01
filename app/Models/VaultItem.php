<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VaultItem extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'title',
        'username',
        'password',
        'url',
        'notes',
    ];

    /**
     * Get the user that owns the vault item.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
