<?php

namespace App\Http\Controllers;

use App\Models\VaultItem;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Log;

class VaultController extends Controller
{
    /**
     * Display a listing of the user's vault items.
     */
    public function index()
    {
        try {
            $items = VaultItem::where('user_id', Auth::id())
                ->latest()
                ->get()
                ->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'title' => $item->title,
                        'username' => $item->username ? Crypt::decryptString($item->username) : null,
                        'password' => $item->password ? Crypt::decryptString($item->password) : null,
                        'url' => $item->url,
                        'notes' => $item->notes ? Crypt::decryptString($item->notes) : null,
                        'created_at' => $item->created_at,
                        'updated_at' => $item->updated_at,
                    ];
                });

            $this->logActivity('viewed_vault', 'Viewed vault items');

            return response()->json($items);
        } catch (\Exception $e) {
            Log::error('Vault index error: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to retrieve vault items',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created vault item.
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'username' => 'nullable|string|max:255',
                'password' => 'nullable|string',
                'url' => 'nullable|url|max:255',
                'notes' => 'nullable|string',
            ]);

            $vaultItem = VaultItem::create([
                'user_id' => Auth::id(),
                'title' => $validated['title'],
                'username' => isset($validated['username']) ? Crypt::encryptString($validated['username']) : null,
                'password' => isset($validated['password']) ? Crypt::encryptString($validated['password']) : null,
                'url' => $validated['url'] ?? null,
                'notes' => isset($validated['notes']) ? Crypt::encryptString($validated['notes']) : null,
            ]);

            $this->logActivity('created_vault_item', 'Created vault item: ' . $validated['title']);

            return response()->json([
                'id' => $vaultItem->id,
                'title' => $vaultItem->title,
                'username' => isset($validated['username']) ? $validated['username'] : null,
                'password' => isset($validated['password']) ? $validated['password'] : null,
                'url' => $vaultItem->url,
                'notes' => isset($validated['notes']) ? $validated['notes'] : null,
                'created_at' => $vaultItem->created_at,
                'updated_at' => $vaultItem->updated_at,
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'error' => 'Validation failed',
                'messages' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Vault store error: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to create vault item',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified vault item.
     */
    public function update(Request $request, $id)
    {
        try {
            $vaultItem = VaultItem::where('user_id', Auth::id())
                ->where('id', $id)
                ->firstOrFail();

            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'username' => 'nullable|string|max:255',
                'password' => 'nullable|string',
                'url' => 'nullable|url|max:255',
                'notes' => 'nullable|string',
            ]);

            $vaultItem->update([
                'title' => $validated['title'],
                'username' => isset($validated['username']) ? Crypt::encryptString($validated['username']) : null,
                'password' => isset($validated['password']) ? Crypt::encryptString($validated['password']) : null,
                'url' => $validated['url'] ?? null,
                'notes' => isset($validated['notes']) ? Crypt::encryptString($validated['notes']) : null,
            ]);

            $this->logActivity('updated_vault_item', 'Updated vault item: ' . $validated['title']);

            return response()->json([
                'id' => $vaultItem->id,
                'title' => $vaultItem->title,
                'username' => isset($validated['username']) ? $validated['username'] : null,
                'password' => isset($validated['password']) ? $validated['password'] : null,
                'url' => $vaultItem->url,
                'notes' => isset($validated['notes']) ? $validated['notes'] : null,
                'created_at' => $vaultItem->created_at,
                'updated_at' => $vaultItem->updated_at,
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'error' => 'Vault item not found'
            ], 404);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'error' => 'Validation failed',
                'messages' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Vault update error: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to update vault item',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified vault item.
     */
    public function destroy($id)
    {
        try {
            $vaultItem = VaultItem::where('user_id', Auth::id())
                ->where('id', $id)
                ->firstOrFail();

            $title = $vaultItem->title;
            $vaultItem->delete();

            $this->logActivity('deleted_vault_item', 'Deleted vault item: ' . $title);

            return response()->json([
                'message' => 'Vault item deleted successfully'
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'error' => 'Vault item not found'
            ], 404);
        } catch (\Exception $e) {
            Log::error('Vault destroy error: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to delete vault item',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Log user activity for security audit.
     */
    private function logActivity($action, $description)
    {
        try {
            AuditLog::create([
                'user_id' => Auth::id(),
                'action' => $action,
                'description' => $description,
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
            ]);
        } catch (\Exception $e) {
            Log::error('Audit log error: ' . $e->getMessage());
        }
    }
}
